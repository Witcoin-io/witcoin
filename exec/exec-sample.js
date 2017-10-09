var Utils = require("../lib//util.js");

var WitcoinPlatform = artifacts.require("./platform/WitcoinPlatform.sol");
var WitcoinSupply = artifacts.require("./platform/WitcoinSupply.sol");
var WitCoin = artifacts.require("./token/WitCoin.sol");

module.exports = function(callback) {

    var promises = [];

    var instances = {
        coin: WitCoin,
        platform: WitcoinPlatform,
        supply: WitcoinSupply
    };

    // Deploy multiple contracts and parse its returned deployed instances
    Utils.deployMultiple(instances).then(function (deployed) {
        instances = Utils.parseDeployed(instances, deployed);

        // All contracts deployed and saved in instances


        promises.push(instances.coin.balanceOf.call("0xAec3aE5d2BE00bfC91597d7A1b2c43818d84396A").then(function(tx) {
            console.log(tx);
        }));

        for (var i=0; i<100; i++) {
            promises.push(instances.coin.transfer("0xf1f42f995046E67b79DD5eBAfd224CE964740Da3", 100000000));
        }

        promises.push(instances.coin.balanceOf.call("0xAec3aE5d2BE00bfC91597d7A1b2c43818d84396A").then(function(tx) {
            console.log(tx);
        }));


        // Callback when all promises finished

        Promise.all(promises).then(function(tx){
            callback();
        });
    }).catch(function(e) {
        console.log(e);
    });

};