var WitcoinPlatform = artifacts.require("./WitcoinPlatform.sol");
var WitcoinSupply = artifacts.require("./WitcoinSupply.sol");
var WitCoin = artifacts.require("./WitCoin.sol");

module.exports = function(callback) {
    var platform;
    var coin;

    // Pre deployed contract
    WitcoinPlatform.deployed().then(function(instance) {
        return instance.getWitcoinSupplyAddress.call();
    }).then(function(tx) {
        console.log(tx);
    }).catch(function(e) {
        console.log(e);
    });

};