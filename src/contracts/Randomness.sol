// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "@chainlink/contracts/src/v0.8/interfaces/VRFCoordinatorV2Interface.sol";
import "@chainlink/contracts/src/v0.8/VRFConsumerBaseV2.sol";
import {LotteryOneInterface} from "./interfaces/LotteryOneInterface.sol";
import {GovernanceInterface} from "./interfaces/GovernanceInterface.sol";

contract Randomness is VRFConsumerBaseV2 {

    GovernanceInterface public governanceContract;

    VRFCoordinatorV2Interface COORDINATOR;

    uint64 constant subscriptionId = 2641;

    bytes32 keyHash = 0x4b09e658ed251bcafeebbc69400383d49f344ace09b9576fe248bb02c003fe9f;

    mapping(uint => address) public requestIdToAddress;

    uint32 public callbackGasLimit = 2500000;

    uint16 requestConfirmations = 3;

    uint32 numWords = 1;

    modifier isAdmin {
        require(msg.sender == governanceContract.admin(), "Not admin");
        _;
    }

    constructor(address _governance)
    VRFConsumerBaseV2(0x7a1BaC17Ccc5b313516C5E16fb24f7659aA5ebed)
    {
        COORDINATOR = VRFCoordinatorV2Interface(
            0x7a1BaC17Ccc5b313516C5E16fb24f7659aA5ebed
        );
        governanceContract = GovernanceInterface(_governance);
    }

    function getRandom() external {
        require(governanceContract.validateLottery(msg.sender), "Not active lottery address");
        uint requestId = COORDINATOR.requestRandomWords(
            keyHash,
            subscriptionId,
            requestConfirmations,
            callbackGasLimit,
            numWords
        );
        requestIdToAddress[requestId] = msg.sender;
    }

    function fulfillRandomWords(uint _requestId, uint[] memory _randomWords) internal override {
        require(requestIdToAddress[_requestId] != address(0), "Request ID not valid");

        address lotteryAddress = requestIdToAddress[_requestId];

        LotteryOneInterface(lotteryAddress).fulfill_drawing(_randomWords[0]);
    }

    function changeGasLimit(uint32 _newLimit) external isAdmin {
        require(_newLimit > 0, "callbackGasLimit must be > 0");
        require(_newLimit != callbackGasLimit, "callbackGasLimit can't be the same as now");
        callbackGasLimit = _newLimit;
    }
}


