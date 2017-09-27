var WitcoinPlatform = artifacts.require("./WitcoinPlatform.sol");
var WitCoin = artifacts.require("./WitCoin.sol");
var WitSupply = artifacts.require("./WitcoinSupply.sol");

module.exports = function(dd) {
    var deployer = dd;
    return deployer.deploy(WitCoin).then(function(){
        return deployer.deploy(WitSupply, WitCoin.address).then(function(){
            return deployer.deploy(WitcoinPlatform, WitCoin.address, WitSupply.address);
        });
    });
};
