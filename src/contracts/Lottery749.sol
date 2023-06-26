// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import {LotteryOneInterface} from './interfaces/LotteryOneInterface.sol';
import {RandomnessInterface} from './interfaces/RandomnessInterface.sol';
import {GovernanceInterface} from "./interfaces/GovernanceInterface.sol";
import {TicketsInterface} from "./interfaces/TicketsInterface.sol";
import '@chainlink/contracts/src/v0.8/interfaces/AutomationCompatibleInterface.sol';
import '@openzeppelin/contracts/security/ReentrancyGuard.sol';
import "./libraries/SafeMath.sol";

contract Lottery749 is LotteryOneInterface, AutomationCompatibleInterface, ReentrancyGuard {

    using SafeMath for uint;
    // Governance contract
    GovernanceInterface public governanceContract;

    // Lottery name
    string public  name = 'lottery749';
    // Minimum number of numbers users must pick to buy a ticket
    uint constant MUSTPICKEDNUMBERS = 7;
    // Jackpot increases each time the game is played but the jackpot is not won by this percentage (of total of value of sold tickets)
    // 1500 in basis points = 15%
    uint constant JACKPOTPERCENTAGE = 1500;
    // Maximum number
    uint constant MAXNUMBER = 49;
    // State of the lottery
    // OPEN - tickets on sale
    // DRAWING - ticket sale is closed, waiting for draw results
    // CLOSED - the lottery is closed, random numbers are drawn, rewards are paid
    enum LOTTERY_STATE {OPEN, DRAWING, CLOSED}

    // Current Lottery Id
    uint public lotteryId;
    // Mapping lottery id => details of the lottery.
    mapping(uint => Lottery) public lottery;

    struct Lottery {
        uint lotteryId; // Lottery Id
        uint minimumPrice; // Minimum ticket price for minimum picked numbers
        LOTTERY_STATE state; // State of the lottery
        uint drawTime; // The lottery draw time
        uint totalValue; // Total amount of tickets playing this lottery draw
        uint jackpot; // Jackpot amount for this lottery draw
    }

    struct LotteryGetterStruct {
        uint id;
        uint minimumPrice;
        LOTTERY_STATE state;
        uint drawTime;
        uint[] drawnNumbers;
        uint amountOfTickets;
        uint totalValue;
        uint jackpot;
        uint jackpotWinners;
    }

    // Growing jackpot amount
    uint public growingJackpot;

    // Precalculated win prize multipliers depending on how many numbers user picked and how many numbers matches the lottery drawn drawnNumbers
    // Mapping "Number of user picked numbers" => "Number of matched numbers" => prize multiplier
    // Exclusion: 6 matched numbers get JACKPOT (if many users won jackpot then jackpot splits equally)
    // Exclusion: 0 or 1 matched numbers means the ticket lost
    mapping(uint => uint) internal prizeMultipliers;

    struct User {
        uint balance;
    }
    // Mapping user address => user info
    mapping(address => User) public users;

    // Mapping lotteryId => number => true if it was drawn
    mapping(uint => mapping(uint => bool)) internal isDrawnNumber;

    // New Lottery Started event
    event NewLotteryStarted(string _name, uint _lotteryId);
    // Ticket Purchased event
    event TicketPurchased(uint _ticketId, uint _ticketPrice, address _user);
    // User withdraw winnings events
    event WithdrawWinnings(address _user, uint _value);
    // User withdraw balance event
    event WithdrawBalance(address _user, uint _value);
    // User made a deposit event
    event Deposit(address _user, uint _value);

    //    // Use an interval in seconds and a timestamp to slow execution of Upkeep
    //    uint public immutable interval;
    //    uint public lastTimeStamp;
    //
    //    event RandomNumberReceived(uint randomNumber);

    modifier isAdmin {
        require(msg.sender == governanceContract.admin(), "Not auth");
        _;
    }

    // Function to create new lottery draw manually if Chainlink keeper fails
    function manual_start_new_lottery() external isAdmin {
        start_new_lottery();
    }

    // Function to create new lottery draw
    function start_new_lottery() internal {
        uint currentDraw = lotteryId;

        uint timeOfNextDraw;
        // If this is not first ever draw
        uint presetDuration = governanceContract.getDuration(address(this));
        if (currentDraw != 0) {
            // Previous lottery draw must be closed
            require(lottery[currentDraw].state == LOTTERY_STATE.CLOSED, 'Current lottery draw must be closed');
            // Protection: timeOfNextDraw needs to be in the future
            timeOfNextDraw = lottery[currentDraw].drawTime + presetDuration;
            while (block.timestamp > timeOfNextDraw) {
                timeOfNextDraw += presetDuration;
            }
            uint prevTotalValue = lottery[currentDraw].totalValue;
            // Growing jackpot calculation
            growingJackpot += prevTotalValue.mul(JACKPOTPERCENTAGE).div(10000);
            // Lottery fee calculation
            users[governanceContract.admin()].balance += prevTotalValue.mul(governanceContract.lotteryFee()).div(10000);
        } else {
            timeOfNextDraw = governanceContract.getFirstDrawTime(address(this));
        }

        uint currentJackpot = governanceContract.getInitialJackpot(address(this));
        if (growingJackpot > currentJackpot) {
            currentJackpot = growingJackpot;
        }

        uint nextDraw = lotteryId + 1;

        lottery[nextDraw] = Lottery({
        lotteryId : nextDraw,
        minimumPrice : governanceContract.getMinimumPrice(address(this)),
        state : LOTTERY_STATE.OPEN,
        drawTime : timeOfNextDraw,
        totalValue : 0,
        jackpot : currentJackpot
        });

        lotteryId++;

        emit NewLotteryStarted(name, lotteryId);
    }

    // Buy new ticket for current lottery draw
    function enter(uint[] memory _pickedNumbers) external payable {
        require(block.timestamp < lottery[lotteryId].drawTime - 5 minutes, 'Ticket sale is closed 5 minutes before draw time');
        require(lottery[lotteryId].state == LOTTERY_STATE.OPEN, 'Ticket sale is not open yet');
        require(_pickedNumbers.length == MUSTPICKEDNUMBERS, 'Not correct number of picked numbers');
        uint ticketPrice = lottery[lotteryId].minimumPrice;
        require(msg.value == ticketPrice, 'The payment is not enough to buy this ticket');

        // Checking uniqueness and that numbers in range 1-MAXNUMBER
        for (uint i = 0; i < MUSTPICKEDNUMBERS; i++) {
            require(_pickedNumbers[i] >= 1, 'Picked numbers must be from 1 to 49');
            require(_pickedNumbers[i] <= MAXNUMBER, 'Picked numbers must be from 1 to 49');
            if (i > 0) require(_pickedNumbers[i] > _pickedNumbers[i - 1], 'Numbers must be sorted');
            bool isUnique = true;

            for (uint n = i + 1; n < MUSTPICKEDNUMBERS; n++) {
                if (_pickedNumbers[i] == _pickedNumbers[n]) {
                    isUnique = false;
                }
            }

            require(isUnique, 'Every picked number must be unique');
        }

        // Creating a new ticket and getting a new ticket number
        uint newTicket = TicketsInterface(governanceContract.tickets()).createTicket(_pickedNumbers, lotteryId, msg.sender);

        // Saving ticketId in current lottery draw
        lottery[lotteryId].totalValue += ticketPrice;

        emit TicketPurchased(newTicket, ticketPrice, msg.sender);
    }

    // Returns user balance
    function getUser() external view returns (uint balance){
        return users[msg.sender].balance;
    }

    // Lottery getter by lotteryId
    function getLotteryById(uint _lotteryId) external view returns (
        uint id,
        uint minimumPrice,
        LOTTERY_STATE state,
        uint drawTime,
        uint[] memory drawnNumbers,
        uint amountOfTickets,
        uint totalValue,
        uint jackpot,
        uint jackpotWinners){

        id = lottery[_lotteryId].lotteryId;
        minimumPrice = lottery[_lotteryId].minimumPrice;
        state = lottery[_lotteryId].state;
        drawTime = lottery[_lotteryId].drawTime;
        amountOfTickets = lottery[_lotteryId].totalValue.div(lottery[_lotteryId].minimumPrice);
        totalValue = lottery[_lotteryId].totalValue;
        jackpot = lottery[_lotteryId].jackpot;
        jackpotWinners = 0;
        drawnNumbers = new uint[](0);

        if (lottery[_lotteryId].state != LOTTERY_STATE.OPEN) {
            uint[] memory tempArr = new uint[](MUSTPICKEDNUMBERS);
            uint numbersCount = 0;
            for (uint i = 1; i <= MAXNUMBER; i++) {
                if (isDrawnNumber[_lotteryId][i]) {
                    tempArr[numbersCount] = i;
                    numbersCount += 1;
                    if (numbersCount == MUSTPICKEDNUMBERS) break;
                }
            }
            drawnNumbers = tempArr;
            jackpotWinners = TicketsInterface(governanceContract.tickets()).getCombinationNumber(id, tempArr);
        }
    }

    // return current lotteryId and last two draws
    function getCurrentLotteryPlusOne() external view returns (
        uint currentId,
        LotteryGetterStruct [] memory lotteryDraws
    ) {
        currentId = lotteryId;

        if (currentId == 0) return (currentId, new LotteryGetterStruct[](0));

        lotteryDraws = new LotteryGetterStruct[](2);

        for (uint index = 0; index < 2; index++) {
            uint _lotteryId = currentId - index;
            if (_lotteryId == 0) break;
            uint[] memory tempArr = new uint[](0);
            uint jackpotWinners = 0;

            if (lottery[_lotteryId].state != LOTTERY_STATE.OPEN) {
                tempArr = new uint[](MUSTPICKEDNUMBERS);
                uint numbersCount = 0;
                for (uint i = 1; i <= MAXNUMBER; i++) {
                    if (isDrawnNumber[_lotteryId][i]) {
                        tempArr[numbersCount] = i;
                        numbersCount += 1;
                        if (numbersCount == MUSTPICKEDNUMBERS) break;
                    }
                }
                jackpotWinners = TicketsInterface(governanceContract.tickets()).getCombinationNumber(_lotteryId, tempArr);
            }

            lotteryDraws[index] = LotteryGetterStruct({
            id : _lotteryId,
            minimumPrice : lottery[_lotteryId].minimumPrice,
            state : lottery[_lotteryId].state,
            drawTime : lottery[_lotteryId].drawTime,
            drawnNumbers : tempArr,
            amountOfTickets : lottery[_lotteryId].totalValue.div(lottery[_lotteryId].minimumPrice),
            totalValue : lottery[_lotteryId].totalValue,
            jackpot : lottery[_lotteryId].jackpot,
            jackpotWinners : jackpotWinners
            });
        }

        return (currentId, lotteryDraws);
    }

    // Lottery getter by array of lotteryIds
    function getLotteryByIds(uint[] memory _ids) external view returns (LotteryGetterStruct [] memory lotteryDraws){
        lotteryDraws = new LotteryGetterStruct[](_ids.length);

        for (uint index = 0; index < _ids.length; index++) {
            uint[] memory tempArr = new uint[](0);
            uint jackpotWinners = 0;
            uint _lotteryId = _ids[index];

            if (lottery[_lotteryId].state != LOTTERY_STATE.OPEN) {
                tempArr = new uint[](MUSTPICKEDNUMBERS);
                uint numbersCount = 0;
                for (uint i = 1; i <= MAXNUMBER; i++) {
                    if (isDrawnNumber[_lotteryId][i]) {
                        tempArr[numbersCount] = i;
                        numbersCount += 1;
                        if (numbersCount == MUSTPICKEDNUMBERS) break;
                    }
                }
                jackpotWinners = TicketsInterface(governanceContract.tickets()).getCombinationNumber(_lotteryId, tempArr);
            }

            lotteryDraws[index] = LotteryGetterStruct({
            id : _lotteryId,
            minimumPrice : lottery[_lotteryId].minimumPrice,
            state : lottery[_lotteryId].state,
            drawTime : lottery[_lotteryId].drawTime,
            drawnNumbers : tempArr,
            amountOfTickets : lottery[_lotteryId].totalValue.div(lottery[_lotteryId].minimumPrice),
            totalValue : lottery[_lotteryId].totalValue,
            jackpot : lottery[_lotteryId].jackpot,
            jackpotWinners : jackpotWinners
            });
        }
    }

    // Function to start lottery drawing if Chainlink Keeper fails
    function manual_start_drawing() external isAdmin {
        start_drawing();
    }

    // Get a random number inside a smart contract using Chainlink VRF when drawTime is up
    function start_drawing() internal {
        require(block.timestamp >= lottery[lotteryId].drawTime, 'Too early for lottery draw');
        bool isSoldTicket = lottery[lotteryId].totalValue > 0;

        if (isSoldTicket) {
            lottery[lotteryId].state = LOTTERY_STATE.DRAWING;
            RandomnessInterface(governanceContract.randomness()).getRandom();
        } else {
            uint presetDuration = governanceContract.getDuration(address(this));
            uint timeOfNextDraw = lottery[lotteryId].drawTime + presetDuration;
            while (block.timestamp > timeOfNextDraw) {
                timeOfNextDraw += presetDuration;
            }
            lottery[lotteryId].drawTime = timeOfNextDraw;
            emit NewLotteryStarted(name, lotteryId);
        }
    }

    // Fulfill lottery drawing once random number is received
    function fulfill_drawing(uint randomness) external {
        require(governanceContract.randomness() == msg.sender, "Not randomness address");

        // getting multiple random numbers
        uint[MUSTPICKEDNUMBERS] memory drawnNumbers;

        uint drawCount = 0;
        uint secondArg = 0;

        while (drawCount < MUSTPICKEDNUMBERS) {
            bool isUnique = true;
            uint number = (uint(keccak256(abi.encode(randomness, secondArg))) % MAXNUMBER) + 1;

            if (drawCount > 0) {
                for (uint i = 0; i < drawCount; i++) {
                    if (number == drawnNumbers[i]) {
                        isUnique = false;
                        break;
                    }
                }
            }

            if (isUnique) {
                drawnNumbers[drawCount] = number;
                isDrawnNumber[lotteryId][number] = true;
                drawCount += 1;
            }
            secondArg++;
        }

        // Closing currect lottery draw
        lottery[lotteryId].state = LOTTERY_STATE.CLOSED;

        start_new_lottery();
    }

    // Function to withdraw ticket prize.
    function withdrawWinnings(uint _ticketId) external nonReentrant {

        address lotteryAddress;
        uint ticketLotteryId;
        uint[] memory pickedNumbers;
        uint paidOut;
        address user;
        uint sameCombinationCounter;

        (lotteryAddress, ticketLotteryId, pickedNumbers, paidOut, user, sameCombinationCounter) = TicketsInterface(governanceContract.tickets()).getTicketById(_ticketId);

        require(msg.sender == user, 'Not correct user');
        require(lotteryAddress == address(this), 'Not correct lottery address');
        require(paidOut == 0, 'Ticket has been rewarded already');

        uint matchedCount = 0;
        for (uint n = 0; n < pickedNumbers.length; n++) {
            if (isDrawnNumber[ticketLotteryId][pickedNumbers[n]]) matchedCount += 1;
        }

        require(matchedCount >= 2, 'Your ticket lost');

        // Depending on how many numbers matched we will determine what tickets won/lost and how much they won
        if ((matchedCount >= 2) && (matchedCount < 7)) {
            paidOut = prizeMultipliers[matchedCount] * lottery[ticketLotteryId].minimumPrice;
        } else if (matchedCount == 7) {
            paidOut = lottery[ticketLotteryId].jackpot.div(sameCombinationCounter);
            growingJackpot = 0;
        }

        require(address(this).balance >= paidOut, 'Not enough funds to withdraw. Try again later');
        payable(user).transfer(paidOut);

        TicketsInterface(governanceContract.tickets()).setPaidOut(_ticketId, paidOut);

        emit WithdrawWinnings(user, paidOut);
    }

    // Function to withdraw balance
    function withdrawBalance(uint value) external nonReentrant {
        require(users[msg.sender].balance >= value, 'Not enough funds');
        require(address(this).balance >= value, 'Not enough funds to withdraw');

        payable(msg.sender).transfer(value);
        users[msg.sender].balance -= value;

        emit WithdrawBalance(msg.sender, value);
    }

    // Function to make a deposit to user balance
    function deposit() external payable {
        require(msg.value > 0, 'Value must be more than 0');
        users[msg.sender].balance += msg.value;

        emit Deposit(msg.sender, msg.value);
    }

    // Executes automatically by Chainlink Keeper if it's a draw time.
    function performUpkeep(bytes calldata performData) external override {
        require(lottery[lotteryId].state == LOTTERY_STATE.OPEN, 'Wrong lottery state');
        uint lotId = abi.decode(performData, (uint));
        require(lotId == lotteryId, 'Wrong lottery id');
        start_drawing();
    }

    // Chainlink Keeper function to check if it's time to start lottery drawing
    function checkUpkeep(bytes calldata checkData) external view override returns (bool upkeepNeeded, bytes memory performData) {
        if (lottery[lotteryId].state == LOTTERY_STATE.OPEN) {
            upkeepNeeded = block.timestamp >= lottery[lotteryId].drawTime;
        } else {
            upkeepNeeded = false;
        }

        checkData;
        performData = abi.encode(lotteryId);

        return (upkeepNeeded, performData);
    }

    constructor(address _governance) payable {
        governanceContract = GovernanceInterface(_governance);
        lotteryId = 0;
        growingJackpot = 0;

        //Precalculated win prize multipliers
        // prize = prizeMultipliers * minimumPrice
        // Exclusion: 7 matched numbers get JACKPOT (if many users won jackpot then jackpot splits equally)
        // Exclusion: 0 or 1 matched numbers means the ticket lost
        prizeMultipliers[2] = 1;
        prizeMultipliers[3] = 2;
        prizeMultipliers[4] = 7;
        prizeMultipliers[5] = 60;
        prizeMultipliers[6] = 3000;
        // 7 = Jackpot only
    }

    receive() external payable {
    }

    //// For test only *******************************************************************************
    //    function fulfill_drawing_tests() external {
    //        // getting multiple random numbers
    //        isDrawnNumber[lotteryId][20] = true;
    //        isDrawnNumber[lotteryId][21] = true;
    //        isDrawnNumber[lotteryId][22] = true;
    //        isDrawnNumber[lotteryId][23] = true;
    //        isDrawnNumber[lotteryId][24] = true;
    //        isDrawnNumber[lotteryId][25] = true;
    //        isDrawnNumber[lotteryId][26] = true;
    //
    //        // Closing currect lottery draw
    //        lottery[lotteryId].state = LOTTERY_STATE.CLOSED;
    //
    //        start_new_lottery();
    //    }
    // ***********************************************************************************************
}