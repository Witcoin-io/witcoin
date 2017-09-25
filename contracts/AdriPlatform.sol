pragma solidity ^0.4.11;

import "./EasyCoinInterface.sol";

contract AdriPlatform {

    address public main;
    address public a1;
    address public a2;

    string public coinStr;

    function AdriPlatform() {
        main = 0xAec3aE5d2BE00bfC91597d7A1b2c43818d84396A;
        a1 = 0xf1f42f995046E67b79DD5eBAfd224CE964740Da3;
        a2 = 0xcFe984B059De5fBFd8875e4A7e7A16298721B823;
        coinStr = "No value set.";
    }

    function setCoinText(address a) {
        EasyCoinInterface coin = EasyCoinInterface(a);
        coinStr = bytes32ToString(coin.saySomething());
    }

    function getCoinText() returns (string) {
        return coinStr;
    }

    function bytes32ToString(bytes32 x) constant returns (string) {
        bytes memory bytesString = new bytes(32);
        uint charCount = 0;
        for (uint j = 0; j < 32; j++) {
            byte char = byte(bytes32(uint(x) * 2 ** (8 * j)));
            if (char != 0) {
                bytesString[charCount] = char;
                charCount++;
            }
        }
        bytes memory bytesStringTrimmed = new bytes(charCount);
        for (j = 0; j < charCount; j++) {
            bytesStringTrimmed[j] = bytesString[j];
        }
        return string(bytesStringTrimmed);
    }

}
