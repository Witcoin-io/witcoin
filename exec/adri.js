var AdriPlatform = artifacts.require("./AdriPlatform.sol");
var AdriCoin = artifacts.require("./AdriCoin.sol");
var VictorCoin = artifacts.require("./VictorCoin.sol");

module.exports = function(callback) {
    var platform;

    // Pre deployed contract
    AdriPlatform.deployed().then(function(ins1) {
        platform = ins1;
        return platform.getCoinText.call();
    }).then(function(tx) {
        console.log(tx);
        return platform.setCoinText(VictorCoin.address);
    }).then(function(tx) {
        return platform.getCoinText.call();
    }).then(function(tx) {
        console.log(tx);
        return platform.setCoinText(AdriCoin.address);
    }).then(function(tx) {
        return platform.getCoinText.call();
    }).then(function(tx) {
        console.log(tx);
        callback();
    });

};