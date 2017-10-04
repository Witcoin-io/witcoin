var WitCoin = artifacts.require("./WitCoin.sol");
var WitcoinCrowdsale = artifacts.require("./WitcoinCrowdsale.sol");

module.exports = function(deployer) {
    deployer.deploy(WitCoin).then(function(){
        deployer.deploy(WitcoinCrowdsale, WitCoin.address);
    });
};
