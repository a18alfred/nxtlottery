// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

library Seriality {
    function getBytes16(uint[] memory array) internal pure returns (bytes16 serialized){

        uint endIndex = array.length;
        require(endIndex < 16);

        bytes16 b;

        b = bytes16(uint128(array[endIndex - 1]));
        for (uint i = 1; i < endIndex; i++) {
            b = b << (8) | bytes16(uint128(array[endIndex - 1 - i]));
        }

        return b;
    }

    function getArray(bytes16 buffer) internal pure returns (uint[] memory output){

        uint[] memory tempArr = new uint[](16);

        uint counter = 0;
        for (uint i = 15; i > 0; i--) {
            tempArr[counter] = uint8(buffer[i]);
            if (tempArr[counter] == 0) break;
            counter++;
        }

        uint[] memory outArr = new uint[](counter);

        for (uint i = 0; i < counter; i++) {
            outArr[i] = tempArr[i];
        }
        return outArr;
    }
}