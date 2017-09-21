var AdriPlatform = artifacts.require("./AdriPlatform.sol");
var AdriCoin = artifacts.require("./AdriCoin.sol");

module.exports = function(deployer) {

    deployer.deploy(AdriCoin).then(function() {
        return deployer.deploy(AdriPlatform, AdriCoin.address);
    });

};
