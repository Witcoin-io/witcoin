var AdriPlatform = artifacts.require("./AdriPlatform.sol");
var AdriCoin = artifacts.require("./AdriCoin.sol");

module.exports = function(callback) {
    var platform;
    var coin;
    var decimals;

    // Pre deployed contract
    AdriPlatform.deployed().then(function(ins1) {
        platform = ins1;
        AdriCoin.deployed().then(function(ins2) {
            coin = ins2;
            return coin.decimals.call();
        }).then(function(d) {
            decimals = d;
            return coin.approve(AdriPlatform.address, 50 * Math.pow(10, decimals));
        }).then(function(tx) {
            return platform.doTransfer(50 * Math.pow(10, decimals));
        }).then(function(tx) {
            return coin.balanceOf("0xf1f42f995046E67b79DD5eBAfd224CE964740Da3");
        }).then(function(tx) {
            console.log(tx);
            callback();
        });

    });
};