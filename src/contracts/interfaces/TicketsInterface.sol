// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

interface TicketsInterface {
    function createTicket(uint[] memory, uint, address) external returns (uint);

    function setPaidOut(uint, uint) external;

    function getTicketById(uint) external view returns (
        address,
        uint,
        uint[] memory,
        uint,
        address,
        uint);

    function getCombinationNumber(uint, uint[] memory) external view returns (uint);
}
