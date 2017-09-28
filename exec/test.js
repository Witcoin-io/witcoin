var WitcoinPlatform = artifacts.require("./WitcoinPlatform.sol");
var WitCoin = artifacts.require("./WitCoin.sol");

module.exports = function(callback) {
    var platform;
    var coin;

    // Pre deployed contract
    WitcoinPlatform.deployed().then(function(ins1) {
        platform = ins1;
        WitCoin.deployed().then(function(ins2) {
            coin = ins2;
            return coin.approve(WitcoinPlatform.address, 100 * Math.pow(10, 8));
        }).then(function(tx) {
            console.log("Aproved");
            return platform.testTransfer();
        }).then(function(tx) {
            console.log(tx);
        }).catch(function(e) {
            console.log(e);
        });

    });
};