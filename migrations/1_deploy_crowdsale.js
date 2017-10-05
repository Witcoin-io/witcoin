var WitCoin = artifacts.require("./WitCoin.sol");
var WitcoinCrowdsale = artifacts.require("./WitcoinCrowdsale.sol");

module.exports = function(deployer) {
    return deployer.deploy(WitCoin).then(function(){
        return deployer.deploy(WitcoinCrowdsale, WitCoin.address);
    });
};
