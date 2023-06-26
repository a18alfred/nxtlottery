// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

interface GovernanceInterface {
    function admin() external view returns (address);

    function randomness() external view returns (address);

    function tickets() external view returns (address);

    function lotteryFee() external view returns (uint);

    function validateLottery(address) external view returns (bool);

    function getMinimumPrice(address) external view returns (uint);

    function getDuration(address) external view returns (uint);

    function getInitialJackpot(address) external view returns (uint);

    function getFirstDrawTime(address) external view returns (uint);
}
