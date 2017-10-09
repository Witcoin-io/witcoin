var WitCoin = artifacts.require("./token/WitCoin.sol");
var CrowdSale = artifacts.require("./crowdsale/WitcoinCrowdsale.sol");

var Utils = require("../lib//util.js");
var readline = require('readline');
var fs = require('fs');

module.exports = function(callback) {

    var EthPrice = 240;

    var instances = {
        coin: WitCoin,
        crowdsale: CrowdSale
    };

    // Deploy multiple contracts and parse its returned deployed instances
    Utils.deployMultiple(instances).then(function (deployed) {
        instances = Utils.parseDeployed(instances, deployed);

        instances.coin.balanceOf("0xAec3aE5d2BE00bfC91597d7A1b2c43818d84396A").then(function(tx){
            console.log(tx);
        });

        instances.crowdsale.buyTokensAltercoins("0xAec3aE5d2BE00bfC91597d7A1b2c43818d84396A", 10000000000).then(function(tx){
            console.log("Buy");
        });

        instances.coin.balanceOf("0xAec3aE5d2BE00bfC91597d7A1b2c43818d84396A").then(function(tx){
            console.log(tx);
        });

    });

};
