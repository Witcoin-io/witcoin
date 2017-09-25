var AdriPlatform = artifacts.require("./WitcoinPlatform.sol");
var AdriCoin = artifacts.require("./AdriCoin.sol");

module.exports = function(callback) {
    var platform;
    var coin;
    var decimals;

    // Pre deployed contract
    WitcoinPlatform.deployed().then(function(ins1) {
        platform = ins1;
        AdriCoin.deployed().then(function(ins2) {
            coin = ins2;
            return coin.decimals.call();
        }).then(function(d) {
            decimals = d;
            return coin.approve(WitcoinPlatform.address, 50 * Math.pow(10, decimals));
        }).then(function(tx) {
            return platform.Register(,50 * Math.pow(10, decimals));
        }).then(function(tx) {
            return coin.balanceOf("0xf1f42f995046E67b79DD5eBAfd224CE964740Da3");
        }).then(function(tx) {
            console.log(tx);
            callback();
        });

    });
};

address witaddress,address author, address[4] citations,string title,string description,uint256 fee, uint witcoins ) {