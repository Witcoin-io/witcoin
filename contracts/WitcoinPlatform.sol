pragma solidity 0.4.15;

import "./WitCoin.sol";
import "./WitcoinSupply.sol";

contract WitcoinPlatform {

    address WitcoinAddress;
    address SupplyAddress;
    address WitsReceiver;
    event info(string txt, uint256 value);

    struct wit {
        address[] citations;
        uint256 reputation;
    }

    mapping (address => wit) wits;

    function WitcoinPlatform(address witcoin, address supply) {
        WitcoinAddress = witcoin;
        SupplyAddress = supply;
        WitsReceiver = 0xf1f42f995046E67b79DD5eBAfd224CE964740Da3;
    }

    function register(address witaddress, address author, address c1, address c2, address c3, address c4, uint256 fee, uint witcoins) {
        uint maxCitations = fee;
        uint maxLevel = witcoins;

        //paga taxa registre al registrador.
        WitCoin coin = WitCoin(WitcoinAddress);
        coin.transferFrom(author, msg.sender, 100000000); // 1 W

        //paga el reward a les citacions.
        rewardCitations(author, 50000000, maxLevel, maxCitations); // 0.5 W

        //si tot correcte guardo el registre.
        wits[witaddress].reputation = 100;
        if (c1 != 0x0) wits[witaddress].citations.push(c1);
        if (c2 != 0x0) wits[witaddress].citations.push(c2);
        if (c3 != 0x0) wits[witaddress].citations.push(c3);
        if (c4 != 0x0) wits[witaddress].citations.push(c4);

        //creació de moneda
        WitcoinSupply supply = WitcoinSupply(SupplyAddress);
        supply.CoinSupply();
    }

    function rewardCitations(address author, uint256 amount, uint level, uint citations){

        WitCoin coin = WitCoin(WitcoinAddress);

        if (level != 0) {
            for (uint i = 0; i < citations; i++) {
                //coin.transferFrom(author, WitsReceiver, amount);
                coin.transfereixBarat(author, WitsReceiver, amount);
                rewardCitations(author, amount, level - 1, citations);
            }
        }
    }
}