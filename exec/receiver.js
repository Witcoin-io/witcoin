var WitCoin = artifacts.require("./WitCoin.sol");
var Sample = artifacts.require("./SampleContract.sol");

var Utils = require("../lib//util.js");

module.exports = function(callback) {

    var instances = {
        coin: WitCoin,
        sample: Sample
    };

    var sender = "0xAec3aE5d2BE00bfC91597d7A1b2c43818d84396A";
    var account2 = "0xf1f42f995046E67b79DD5eBAfd224CE964740Da3";
    var contractt = "0xa3c60cfbf460460bcfc0c9840102601c6714f233";

    // Deploy multiple contracts and parse its returned deployed instances
    Utils.deployMultiple(instances).then(function (deployed) {
        instances = Utils.parseDeployed(instances, deployed);

        // var _to = account2;
        var _to = Sample.address;

        instances.coin.balanceOf.call(_to).then(function(tx){
            console.log(tx / Math.pow(10, 8));
        });

        return instances.coin.changeMinter(sender).then(function(tx){
            return instances.coin.mint(sender, 100 * Math.pow(10, 8)).then(function(tx){
                return instances.coin.transfer(_to, 10 * Math.pow(10, 8)).then(function(result){
                    return instances.coin.balanceOf.call(_to).then(function(tx){
                        console.log(tx / Math.pow(10, 8));
                        return instances.sample.sender.call().then(function(tx){
                            console.log("Address: " + tx);
                            return instances.coin.balanceOf.call(sender).then(function(tx){
                                console.log(tx / Math.pow(10, 8));
                            });
                        });
                    });
                });
            });
        }).catch(function(e){
            console.log(e);
        });

        // instances.coin.transfer(account2, 10 * Math.pow(10, 8));
        //
        // instances.coin.balanceOf(account2).then(function(tx){
        //     console.log(tx);
        // });

    });

};
