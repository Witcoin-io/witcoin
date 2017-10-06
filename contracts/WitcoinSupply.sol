pragma solidity ^0.4.15;

import "./WitcoinSupplyInterface.sol";
import "./token/WitCoin.sol";

contract WitcoinSupply is WitcoinSupplyInterface {
    address WitcoinPlatform;
    address WitcoinAddress;
    address WitcoinClub;
    uint256 t = 20;

    event info(string txt, uint256 value);

    function WitcoinSupply(address a, address p) {
        WitcoinAddress = a;
        WitcoinPlatform = p;
        WitcoinClub = 0xcFe984B059De5fBFd8875e4A7e7A16298721B823;
    }

    modifier onlyWitcoinPlatform {
        require(msg.sender == WitcoinPlatform);
        _;
    }

    function CoinSupply() onlyWitcoinPlatform {
        WitCoin coin = WitCoin(WitcoinAddress);
        address payingAccount = msg.sender;
        uint256 c = 10 ** 9;
        uint256 k = 1;
        uint256 n = k*e(t);
        uint256 kn = n / c;
        uint256 logv = log(kn);
        uint256 dec = coin.decimals();
        uint256 generatedWitcoins = (10 ** dec)/logv;
        //uint256 generatedWitcoins = 100000000; // 1 witcoin

        //info("generatedWitcoins", generatedWitcoins);

        t = t + 1;
        supply(generatedWitcoins);
    }

    function log(uint256 value) internal returns(uint256) {
        uint256 x = value * 1000000;
        uint256 LOG = 0;
        while (x >= 1500000) {
            LOG = LOG + 405465;
            x = x * 2 / 3;
        }
        x = x - 1000000;
        uint256 y = x;
        uint256 i = 1;
        while (i < 10){
            LOG = LOG + (y / i);
            i = i + 1;
            y = y * x / 1000000;
            LOG = LOG - (y / i);
            i = i + 1;
            y = y * x / 1000000;
        }
        return LOG / 1000000;
    }

    function e(uint256 value) internal returns(uint256) {
        uint256 result;
        result = 3 ** value;
        return result;
    }

    function supply(uint256 witcoins) internal {
        uint f1 = 10;
        uint f2 = 40;
        uint f3 = 40;
        uint f4 = 10;

        uint q1 = witcoins * f1 / 100;
        uint q2 = witcoins * f2 / 100;
        uint q3 = witcoins * f3 / 100;
        uint q4 = witcoins - q1 - q2 - q3;

        // Miner reward
        supplyMiner(q1);

        // Community reward
        supplyCommunity(q2);

        // Registrars reward
        supplyRegistrar(q3);

        // Dividends
        supplyDividends(q4);
    }

    function supplyWitcoins(address to, uint256 amount) internal {
        if (amount > 0) {
            WitCoin coin = WitCoin(WitcoinAddress);
            coin.mint(to, amount);
        }
    }

    function supplyMiner(uint256 amount) internal {
        address miner = block.coinbase;
        supplyWitcoins(miner, amount);
    }

    function supplyCommunity(uint256 amount) internal {
        supplyWitcoins(WitcoinClub, amount);
    }

    function supplyRegistrar(uint256 amount) internal {
        address registrar = msg.sender;
        supplyWitcoins(registrar, amount);
    }

    function supplyDividends(uint256 amount) internal {
        address witsowner = 0xf1f42f995046E67b79DD5eBAfd224CE964740Da3; // Lottery?
        supplyWitcoins(witsowner, amount);
    }
}
