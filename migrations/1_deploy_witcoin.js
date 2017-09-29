var WitcoinPlatform = artifacts.require("./WitcoinPlatform.sol");
var WitCoin = artifacts.require("./WitCoin.sol");
var WitcoinSupply = artifacts.require("./WitcoinSupply.sol");
var WitcoinFactory = artifacts.require("./WitcoinFactory.sol");

module.exports = function(dd) {
    var deployer = dd;
    var platform;
    return deployer.deploy(WitCoin).then(function(){
        return deployer.deploy(WitcoinPlatform, WitCoin.address).then(function(){
            return deployer.deploy(WitcoinSupply, WitCoin.address, WitcoinPlatform.address).then(function(){
                return deployer.deploy(WitcoinFactory, WitcoinPlatform.address).then(function(){
                    return WitcoinPlatform.deployed().then(function(instance) {
                        platform = instance;
                        return platform.setWitcoinSupplyAddress(WitcoinSupply.address);
                    }).then(function() {
                        return platform.setWitcoinFactoryAddress(WitcoinFactory.address);
                    });
                });
            });
        });
    });
};
