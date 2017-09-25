var AdriPlatform = artifacts.require("./AdriPlatform.sol");
var AdriCoin = artifacts.require("./AdriCoin.sol");
var VictorCoin = artifacts.require("./VictorCoin.sol");
var XaviCoin = artifacts.require("./XaviCoin.sol");

module.exports = function(deployer) {
    var contracts = [AdriPlatform, AdriCoin, VictorCoin, XaviCoin];
    contracts.forEach(function(contract) {
        deployer.deploy(contract);
    });
};
