var WitCoin = artifacts.require("./WitCoin.sol");
var WitcoinCrowdsale = artifacts.require("./WitcoinCrowdsale.sol");

module.exports = function(dd) {
    var deployer = dd;
    var platform;
    return deployer.deploy(WitCoin).then(function(){
        return deployer.deploy(WitcoinPlatform, WitCoin.address).then(function(){
            return deployer.deploy(WitcoinSupply, WitCoin.address, WitcoinPlatform.address).then(function(){
                return deployer.deploy(WitcoinFactory, WitcoinPlatform.address).then(function(){
                    return deployer.deploy(WitcoinCrowdsale, 1508137200, 1507618800, 1509973200, 113636360000000000, 0xf1f42f995046E67b79DD5eBAfd224CE964740Da3).then(function(){
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
    });
};
