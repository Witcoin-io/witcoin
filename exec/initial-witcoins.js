let WitCoin = artifacts.require("./WitCoin.sol");
let WitcoinCrowdsale = artifacts.require("./WitcoinCrowdsale.sol");

let Utils = require("../lib//util.js");

module.exports = function(callback) {

    // var instances = {
    //     coin: {
    //         contract: WitCoin,
    //         address: "0x9e7e5b5651e826B301A9567a5Bb950a42bb17904" // REAL
    //     },
    // };

    var instances = {
        coin: WitCoin
    };

    var sender = "0xAec3aE5d2BE00bfC91597d7A1b2c43818d84396A";

    // Deploy multiple contracts and parse its returned deployed instances
    Utils.deployMultiple(instances).then(function (deployed) {
        instances = Utils.parseDeployed(instances, deployed);

        instances.coin.mint(sender, 420000000000).then(function(tx){
            return instances.coin.balanceOf.call(sender);
        }).then(function(result){
            console.log("Balance: " + result)
        });

    });

};
