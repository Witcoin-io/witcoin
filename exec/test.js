var WitcoinPlatform = artifacts.require("./WitcoinPlatform.sol");
var WitcoinSupply = artifacts.require("./WitcoinSupply.sol");
var WitCoin = artifacts.require("./WitCoin.sol");
var Utils = require("./util.js");

module.exports = function(callback) {

    var instances = {
        coin: WitCoin,
        platform: WitcoinPlatform,
        supply: WitcoinSupply
    };

    Utils.deployMultiple(instances).then(function (deployed) {
        instances = Utils.parseDeployed(instances, deployed);
        instances.coin.transfer("0xAec3aE5d2BE00bfC91597d7A1b2c43818d84396A", 100000000).then(function(tx) {
            console.log(tx.receipt.gasUsed);
        });
    }).catch(function(e) {
        console.log(e);
    });


    // Pre deployed contract
    // WitCoin.deployed().then(function(instance) {
    //     console.log(WitCoin.deployed());
    //     WitCoin.deployed().transfer("0xAec3aE5d2BE00bfC91597d7A1b2c43818d84396A", 100000000).then(function(tx) {
    //         console.log(tx.receipt.gasUsed);
    //     });
    // }).catch(function(e) {
    //     console.log(e);
    // });

};