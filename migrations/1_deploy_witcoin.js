var WitcoinPlatform = artifacts.require("./WitcoinPlatform.sol");
var WitCoin = artifacts.require("./WitCoin.sol");
var WitcoinSupply = artifacts.require("./WitcoinSupply.sol");

module.exports = function(dd) {
    var deployer = dd;
    return deployer.deploy(WitCoin).then(function(){
        return deployer.deploy(WitcoinPlatform, WitCoin.address).then(function(){
            return deployer.deploy(WitcoinSupply, WitCoin.address, WitcoinPlatform.address).then(function(){
                return WitcoinPlatform.deployed().then(function(instance) {
                    return instance.setWitcoinSupplyAddress(WitcoinSupply.address);
                });
            });
        });
    });
};
