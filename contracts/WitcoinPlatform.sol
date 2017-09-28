pragma solidity 0.4.15;

import "./WitCoin.sol";
import "./WitcoinSupplyInterface.sol";

contract WitcoinPlatform {

    address owner;

    address WitcoinAddress;
    address SupplyAddress = 0x0;
    address WitsReceiver;
    address WitcoinClub;

    uint256 t = 10;
    uint256 MAX_DIVISIONS = 1000;

    event info(string txt, uint256 value);
    event debug(string txt, uint256 value);

    struct wit {
        address[] citations;
        uint256 reputation;
    }

    mapping (address => wit) wits;

    function WitcoinPlatform(address witcoin) {
        owner = msg.sender;
        WitcoinAddress = witcoin;
        WitsReceiver = 0xf1f42f995046E67b79DD5eBAfd224CE964740Da3;
    }

    modifier onlyOwner {
        require(msg.sender == owner);
        _;
    }

    function setWitcoinSupplyAddress(address a) onlyOwner {
        SupplyAddress = a;
    }

    function register(address witaddress, address author, address c1, address c2, address c3, address c4, uint256 fee, uint witcoins) {
        WitCoin coin = WitCoin(WitcoinAddress);
        uint maxCitations = fee;
        uint maxLevel = witcoins;

        // Author to contract
        coin.transferFrom(author, address(this), 100 * (10 ** 8)); // 100 W

        // Paga taxa registra al registrador.
        coin.transfer(msg.sender, 1 * (10 ** 8)); // 1 W

        // Paga el reward a les citacions.
        rewardCitations(0.5 * (10 ** 8), 0, maxLevel, maxCitations); // 0.5 W

        // Si tot correcte guardo el registre.
        wits[witaddress].reputation = 100;
        if (c1 != 0x0) wits[witaddress].citations.push(c1);
        if (c2 != 0x0) wits[witaddress].citations.push(c2);
        if (c3 != 0x0) wits[witaddress].citations.push(c3);
        if (c4 != 0x0) wits[witaddress].citations.push(c4);

        //creació de moneda
        if (SupplyAddress != 0x0) {
            WitcoinSupplyInterface(SupplyAddress).CoinSupply();
        }
    }

    function rewardCitations(uint256 amount, uint256 current, uint level, uint citations) returns(uint256) {

        WitCoin coin = WitCoin(WitcoinAddress);

        if (level != 0 && current < MAX_DIVISIONS) {
            for (uint i = 0; i < citations; i++) {
                if (current < MAX_DIVISIONS) {
                    current++;
                    coin.transfer(WitsReceiver, amount);
                    current = rewardCitations(amount, current, level - 1, citations);
                }
            }
        }

        return current;
    }
}