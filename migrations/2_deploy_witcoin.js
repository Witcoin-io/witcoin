var WitcoinPlatform = artifacts.require("./WitcoinPlatform.sol");
var WitCoin = artifacts.require("./WitCoin.sol");

module.exports = function(dd) {
    var deployer = dd;
    return deployer.deploy(WitCoin).then(function(){
        return deployer.deploy(WitcoinPlatform, WitCoin.address);
    });
};
