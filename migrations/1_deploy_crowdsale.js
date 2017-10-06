var WitCoin = artifacts.require("./WitCoin.sol");
var WitcoinCrowdsale = artifacts.require("./WitcoinCrowdsale.sol");

module.exports = function(deployer) {
    return deployer.deploy(WitCoin).then(function(){
        return deployer.deploy(WitcoinCrowdsale, WitCoin.address, 0x2052d46d53107b0384503be3a11935f0b5cd5342).then(function() { // 0xf1f42f995046E67b79DD5eBAfd224CE964740Da3
            return WitCoin.deployed().then(function(coin) {
                return coin.changeMinter(WitcoinCrowdsale.address);
            });
        });
    });
};
