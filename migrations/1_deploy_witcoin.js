var WitcoinPlatform = artifacts.require("./WitcoinPlatform.sol");
var WitCoin = artifacts.require("./WitCoin.sol");
var WitcoinSupply = artifacts.require("./WitcoinSupply.sol");
var WitcoinFactory = artifacts.require("./WitcoinFactory.sol");
var WitcoinCrowdsale = artifacts.require("./WitcoinCrowdsale.sol");

module.exports = function(dd) {
    var deployer = dd;
    var platform;
    return deployer.deploy(WitCoin).then(function(){
        return deployer.deploy(WitcoinPlatform, WitCoin.address).then(function(){
            return deployer.deploy(WitcoinSupply, WitCoin.address, WitcoinPlatform.address).then(function(){
                return deployer.deploy(WitcoinFactory, WitcoinPlatform.address).then(function(){
                    // Sale start: 1508137200
                    // Presale start: 1507618800
                    // End: 1509973200
                    // Rate: 880
                    return deployer.deploy(WitcoinCrowdsale, 1508137200, 1504512776, 1509973200, 880, 0xf1f42f995046E67b79DD5eBAfd224CE964740Da3).then(function(){
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
