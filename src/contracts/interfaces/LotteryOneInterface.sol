// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

interface LotteryOneInterface {
    function manual_start_new_lottery() external;

    function enter(uint[] memory) external payable;

    function manual_start_drawing() external;

    function fulfill_drawing(uint) external;

    function withdrawWinnings(uint) external;

    function withdrawBalance(uint) external;

    function deposit() external payable;
}
