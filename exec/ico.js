var WitCoin = artifacts.require("./WitCoin.sol");
var CrowdSale = artifacts.require("./WitcoinCrowdsale.sol");

module.exports = function(callback) {
    var coin;
    var crowdsale;

    // Pre deployed contract
    WitCoin.deployed().then(function(instance) {
        coin = instance;
        CrowdSale.deployed().then(function(ins2) {
            crowdsale = ins2;
            crowdsale.presale.call().then(function(result) {
                console.log("Presale:" + result);
            });
            crowdsale.sale.call().then(function(result) {
                console.log("Sale:" + result);
            });

        });
    });

};