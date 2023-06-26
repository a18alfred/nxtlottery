// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import {GovernanceInterface} from "./interfaces/GovernanceInterface.sol";
import "./libraries/Seriality.sol";

contract Tickets {

    GovernanceInterface public governanceContract;

    // Total number of tickets
    uint public numberOfTickets;
    // Mapping ticketId => details of the ticket
    mapping(uint => Ticket) public tickets;
    // Mapping user address => array of user's tickets ID
    mapping(address => uint[]) public users;
    // Mapping lottery address => lotteryId => bytes16 (pickedNumbers) => picked numbers counter
    // It show how many tickets have the same combination
    mapping(address => mapping(uint => mapping(bytes16 => uint))) internal combinationCounter;

    struct Ticket {
        address lotteryAddress;
        uint lotteryId; // Lottery ID
        bytes16 pickedNumbers; // Numbers user picked
        uint paidOut; // How much ticket won
        address user; // The user who owns the ticket
    }

    struct TicketGetterStruct {
        uint ticketId;
        address lotteryAddress;
        uint ticketLotteryId;
        uint[] pickedNumbers;
        uint paidOut;
        address user;
        uint sameCombinationCounter;
    }

    // Ticket Created event
    event TicketCreated(uint _ticketId, address indexed _user);

    function createTicket(uint[] memory _pickedNumbers, uint _lotteryId, address _userAddress) external returns (uint ticketNumber) {
        require(governanceContract.validateLottery(msg.sender), "Not lottery address");

        // Increasing number of sold tickets
        uint newTicket = numberOfTickets + 1;

        bytes16 numbersSerialized = Seriality.getBytes16(_pickedNumbers);
        // Creating a new ticket
        tickets[newTicket] = Ticket({
        lotteryAddress : msg.sender,
        lotteryId : _lotteryId,
        pickedNumbers : numbersSerialized,
        paidOut : 0,
        user : _userAddress
        });

        combinationCounter[msg.sender][_lotteryId][numbersSerialized] += 1;
        // Saving ticketId in user tickets mapping
        users[_userAddress].push(newTicket);
        // Increasing total number of tickets
        numberOfTickets++;

        emit TicketCreated(newTicket, msg.sender);

        return newTicket;
    }

    function setPaidOut(uint _ticketId, uint _paidOut) external {
        require(governanceContract.validateLottery(msg.sender), "Not lottery address");

        tickets[_ticketId].paidOut = _paidOut;
    }

    // Ticket getter by ticketId
    function getTicketById(uint _ticketId) external view returns (
        address lotteryAddress,
        uint ticketLotteryId,
        uint[] memory pickedNumbers,
        uint paidOut,
        address user,
        uint sameCombinationCounter){

        lotteryAddress = tickets[_ticketId].lotteryAddress;
        ticketLotteryId = tickets[_ticketId].lotteryId;
        pickedNumbers = Seriality.getArray(tickets[_ticketId].pickedNumbers);
        paidOut = tickets[_ticketId].paidOut;
        user = tickets[_ticketId].user;
        sameCombinationCounter = combinationCounter[lotteryAddress][ticketLotteryId][tickets[_ticketId].pickedNumbers];
    }

    // Returns user tickets paginated
    function getUserTickets(uint _page, uint _resultsPerPage) external view returns (
        uint totalAmountOfTickets,
        TicketGetterStruct[] memory userTickets,
        bool isNextPage){

        totalAmountOfTickets = users[msg.sender].length;

        if (_page == 0 || _resultsPerPage == 0) {
            return (totalAmountOfTickets, new TicketGetterStruct[](0), isNextPage);
        }

        uint _index = _resultsPerPage * _page - _resultsPerPage;

        // return empty array if already empty or _index is out of bounds
        if (
            users[msg.sender].length == 0 ||
            _index > totalAmountOfTickets - 1
        ) {
            return (totalAmountOfTickets, new TicketGetterStruct[](0), isNextPage);
        }

        userTickets = new TicketGetterStruct[](_resultsPerPage);
        // start starting counter for return array
        uint _returnCounter = 0;
        // loop through array from starting point to end point
        for (
            _index;
            _index < _resultsPerPage * _page;
            _index++
        ) {
            // add array item unless out of bounds if so add uninitialized value (0 in the case of uint)
            if (_index <= totalAmountOfTickets - 1) {
                uint reversedIndex = totalAmountOfTickets - 1 - _index;
                uint id = users[msg.sender][reversedIndex];

                userTickets[_returnCounter] = TicketGetterStruct({
                ticketId : id,
                lotteryAddress : tickets[id].lotteryAddress,
                ticketLotteryId : tickets[id].lotteryId,
                pickedNumbers : Seriality.getArray(tickets[id].pickedNumbers),
                paidOut : tickets[id].paidOut,
                user : tickets[id].user,
                sameCombinationCounter : combinationCounter[tickets[id].lotteryAddress][tickets[id].lotteryId][tickets[id].pickedNumbers]
                });
            }

            _returnCounter++;
        }

        if (_index < totalAmountOfTickets) isNextPage = true;

        return (totalAmountOfTickets, userTickets, isNextPage);
    }

    // Return number of combinations of particular set of numbers
    function getCombinationNumber(uint _lotteryId, uint[] memory _drawnNumbers) external view returns (
        uint combinationNumber){
        bytes16 numbersSerialized = Seriality.getBytes16(_drawnNumbers);
        combinationNumber = combinationCounter[msg.sender][_lotteryId][numbersSerialized];
    }

    constructor(address _governance) {
        governanceContract = GovernanceInterface(_governance);
        numberOfTickets = 0;
    }
}
