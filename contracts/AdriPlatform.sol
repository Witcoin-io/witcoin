pragma solidity ^0.4.11;

import "./AdriCoin.sol";

contract AdriPlatform {

    address public coinContractAddress;

    address public main;
    address public a1;
    address public a2;

    function AdriPlatform(address a) {
        coinContractAddress = a;

        main = 0xAec3aE5d2BE00bfC91597d7A1b2c43818d84396A;
        a1 = 0xf1f42f995046E67b79DD5eBAfd224CE964740Da3;
        a2 = 0xcFe984B059De5fBFd8875e4A7e7A16298721B823;
    }

    function doTransfer(uint256 value) {
        AdriCoin coin = AdriCoin(coinContractAddress);
        coin.transferFrom(main, a1, value);
    }

    function doSecondTransfer(uint256 value) {
        AdriCoin coin = AdriCoin(coinContractAddress);
        coin.transferFrom(main, a2, value);
    }

    function whoIAm() returns(address){
        return msg.sender;
    }

}
