pragma solidity 0.4.15;


import "./WitCoin.sol";


contract WitcoinPlatform {

    address WitcoinAddress;
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

    function WitcoinPlatform(address a) {
        WitcoinAddress = a;
        WitsReceiver = 0xf1f42f995046E67b79DD5eBAfd224CE964740Da3;
        WitcoinClub = 0xcFe984B059De5fBFd8875e4A7e7A16298721B823;
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

        // Creacio moneda
        uint256 generatedWitcoins = AcknowledgementValidation();
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

    function log(uint256 value) returns(uint256) {
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
//        info("log", LOG);
        return LOG / 1000000;
    }

    function e(uint256 value) returns(uint256) {
        uint256 result;
        result = 3 ** value;
        return result;
    }

    function AcknowledgementValidation()public returns (uint256) {
        WitCoin coin = WitCoin(WitcoinAddress);
        address payingAccount = msg.sender;
        uint256 c = 10 ** 9;
        uint256 k = 1;
        uint256 n = k*e(t);
        uint256 kn = n / c;
        //uint256 generatedWitcoins = (10 ** coin.decimals())/log(kn);
        uint256 generatedWitcoins = 100000000; // 1 witcoin

        //info("log10", log(10));
        //info("log100", log(100));
        //info("log1000", log(1000));
//        info("t", t);
//        info("n", n);
//        info("kn", kn);
//        info("generatedWitcoins", generatedWitcoins);

        t = t + 1;
        supply(generatedWitcoins);
        return generatedWitcoins;
    }

    function supply(uint256 witcoins) {
        uint f1 = 10;
        uint f2 = 40;
        uint f3 = 40;
        uint f4 = 10;

        uint q1 = witcoins * f1 / 100;
        uint q2 = witcoins * f2 / 100;
        uint q3 = witcoins * f3 / 100;
        uint q4 = witcoins - q1 - q2 - q3;

        // Miner reward
        address miner = block.coinbase;
        supplyWitcoins(miner, q1);

        // Community reward
        supplyWitcoins(WitcoinClub, q2);

        // Registrars reward
        supplyRegistrars(q3);

        // Dividends
        supplyDividends(q4);
    }

    function supplyWitcoins(address to, uint256 amount) {
        WitCoin coin = WitCoin(WitcoinAddress);
        coin.mint(to, amount);
    }

    function supplyRegistrars(uint256 amount) {
        address registrar = msg.sender;
        supplyWitcoins(registrar, amount);
    }

    function supplyDividends(uint256 amount) {
        address witsowner = 0xf1f42f995046E67b79DD5eBAfd224CE964740Da3;
        supplyWitcoins(witsowner, amount);
    }

}