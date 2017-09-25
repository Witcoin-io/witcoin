var WitcoinPlatform = artifacts.require("./WitcoinPlatform.sol");
var WitCoin = artifacts.require("./WitCoin.sol");

module.exports = function(callback) {
    var platform;
    var coin;
    var decimals = 8;

    // Pre deployed contract
    WitcoinPlatform.deployed().then(function(ins1) {
        platform = ins1;
        WitCoin.deployed().then(function(ins2) {
            coin = ins2;
            return coin.approve(WitcoinPlatform.address, 129 * Math.pow(10, decimals));
        }).then(function(tx) {
            return platform.register("0x87f42f995046E67b79DD5eBAfd224CE964740Da3", "0xAec3aE5d2BE00bfC91597d7A1b2c43818d84396A",
                                     "0x65f42f995046E67b79DD5eBAfd224CE964740Da3", "0x65f42f995046E67b79DD5eBAfd224CE964740Da3","0x65f42f995046E67b79DD5eBAfd224CE964740Da3","0x65f42f995046E67b79DD5eBAfd224CE964740Da3", 10, 10);
        }).then(function(tx) {
            console.log("Gas: " + tx.receipt.gasUsed);
            return coin.balanceOf("0xAec3aE5d2BE00bfC91597d7A1b2c43818d84396A");
        }).then(function(tx) {
            console.log("Balance Register: " + tx);
            return coin.balanceOf("0xf1f42f995046E67b79DD5eBAfd224CE964740Da3");
        }).then(function(tx) {
            console.log("Balance Account 2: " + tx);
            return coin.balanceOf("0xcFe984B059De5fBFd8875e4A7e7A16298721B823");
        }).then(function(tx) {
            console.log("Balance Account 3: " + tx);
            callback();
        }).catch(function(e) {
            console.log(e);
        });

    });
};