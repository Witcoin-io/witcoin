var WitCoin = artifacts.require("./WitCoin.sol");
var WitcoinCrowdsale = artifacts.require("./WitcoinCrowdsale.sol");

module.exports = function(deployer) {
    return deployer.deploy(WitCoin).then(function(){
        return deployer.deploy(WitcoinCrowdsale, WitCoin.address, "0xecB6822b2aF187A7115C50Ac31797CC04ca4b21f").then(function() { // 0xf1f42f995046E67b79DD5eBAfd224CE964740Da3
            return WitCoin.deployed().then(function(coin) {
                return coin.changeMinter(WitcoinCrowdsale.address);
            });
        });
    });
};
