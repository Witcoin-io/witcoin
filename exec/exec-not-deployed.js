var WitCoin = artifacts.require("./WitCoin.sol");
var WitcoinCrowdsale = artifacts.require("./WitcoinCrowdsale.sol");

var Utils = require("../lib//util.js");

module.exports = function(callback) {

    var instances = {
        coin: {
            contract: WitCoin,
            address: "0x9e7e5b5651e826B301A9567a5Bb950a42bb17904"
        },
        crowdsale: {
            contract: WitcoinCrowdsale,
            address: "0x85E49AD719a539fb9fBb1dfe0ce9A2cc184D5C9f"
        }
    };

    // Deploy multiple contracts and parse its returned deployed instances
    Utils.atMultiple(instances).then(function (deployed) {
        instances = Utils.parseDeployed(instances, deployed);

        instances.coin.balanceOf.call("0xf1f42f995046E67b79DD5eBAfd224CE964740Da3").then(function(tx){
            console.log("Balance: " + tx / Math.pow(10, 8));
        });

        instances.crowdsale.startTime.call().then(function(tx){
            console.log("Start: " + tx);
        });

    });

};
