// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import {GovernanceInterface} from "./interfaces/GovernanceInterface.sol";

contract Governance is GovernanceInterface {
    // Address of admin account
    address public admin;

    // Address of randomness contract
    address public randomness;

    // Address of tickets contract
    address public tickets;

    uint public lotteryFee; // Lottery fee (in basis points) 1% = 100 basis points

    // Mapping lottery address => the lottery settings.
    mapping(address => Lottery) public lotteries;

    // Array of active lotteries
    address[] public activeLotteries;

    struct Lottery {
        bool isActive; // True if the lottery if active
        uint minimumPrice; // Minimum price of the lottery ticket with minimum selected numbers
        uint initialJackpot; // Starting jackpot amount
        uint firstDrawTime; // Time of the first lottery draw
        uint duration; // Lottery duration
        uint index;
    }

    modifier isAdmin {
        require(admin == msg.sender, "not-an-admin");
        _;
    }

    function changeAdmin(address _admin) external isAdmin {
        require(_admin != address(0), "governance/no-admin-address");
        require(admin != _admin, "governance/same-admin");
        admin = _admin;
    }

    function changeRandom(address _randomness) external isAdmin {
        require(_randomness != address(0), "governance/no-randomnesss-address");
        require(_randomness != randomness, "governance/same-randomnesss-address");
        randomness = _randomness;
    }

    function changeFee(uint _lotteryFee) external isAdmin {
        require(_lotteryFee <= 5000, "Lottery fee is too high");
        require(_lotteryFee != lotteryFee, "Lottery Fee can't be the same as now");
        lotteryFee = _lotteryFee;
    }

    function changeMinimumPrice(address _lotteryAddress, uint _price) external isAdmin {
        require(_price > 0, "The price needs to be more than zero");
        lotteries[_lotteryAddress].minimumPrice = _price;
    }

    function changeInitialJackpot(address _lotteryAddress, uint _initialJackpot) external isAdmin {
        require(_initialJackpot > 0, "Jackpot needs to be more than zero");
        lotteries[_lotteryAddress].initialJackpot = _initialJackpot;
    }

    function changeDuration(address _lotteryAddress, uint _duration) external isAdmin {
        require(_duration >= 3600, "Duration must be more than 60 minutes");
        lotteries[_lotteryAddress].duration = _duration;
    }

    function init(address _randomness, address _tickets, uint _lotteryFee) external isAdmin {
        require(_randomness != address(0), "governance/no-randomnesss-address");

        randomness = _randomness;
        tickets = _tickets;
        lotteryFee = _lotteryFee;
    }

    function addLottery(
        address _lottery,
        uint _minimumPrice,
        uint _duration,
        uint _initialJackpot,
        uint _firstDrawTime
    ) external isAdmin {
        require(_lottery != address(0), "no-lottery-address-given");
        require(_duration >= 3600, "duration must be longer");
        require(!lotteries[_lottery].isActive, "lottery-is-already-active");

        uint nextIndex = activeLotteries.length;
        activeLotteries.push(_lottery);

        lotteries[_lottery].isActive = true;
        lotteries[_lottery].minimumPrice = _minimumPrice;
        lotteries[_lottery].duration = _duration;
        lotteries[_lottery].initialJackpot = _initialJackpot;
        lotteries[_lottery].firstDrawTime = _firstDrawTime;
        lotteries[_lottery].index = nextIndex;
    }

    function cancelLottery(address _lottery) external isAdmin {
        require(_lottery != address(0), "no-lottery-address-given");
        require(lotteries[_lottery].isActive, "not-active-lottery");

        uint index = lotteries[_lottery].index;
        uint lastIndex = activeLotteries.length - 1;
        address temp = activeLotteries[lastIndex];
        activeLotteries[lastIndex] = _lottery;
        activeLotteries[index] = temp;
        lotteries[temp].index = index;

        activeLotteries.pop();

        lotteries[_lottery].isActive = false;
    }

    function validateLottery(address _lotteryAddress) external view returns (bool) {
        return lotteries[_lotteryAddress].isActive;
    }

    function getMinimumPrice(address _lotteryAddress) external view returns (uint) {
        return lotteries[_lotteryAddress].minimumPrice;
    }

    function getDuration(address _lotteryAddress) external view returns (uint) {
        return lotteries[_lotteryAddress].duration;
    }

    function getInitialJackpot(address _lotteryAddress) external view returns (uint) {
        return lotteries[_lotteryAddress].initialJackpot;
    }

    function getFirstDrawTime(address _lotteryAddress) external view returns (uint) {
        return lotteries[_lotteryAddress].firstDrawTime;
    }

    function getActiveLotteries() external view returns (address[] memory list) {
        return activeLotteries;
    }

    constructor() {
        admin = msg.sender;
    }

}

