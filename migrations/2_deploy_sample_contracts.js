var SampleContract = artifacts.require("./SampleContract.sol");
var AdriCoin = artifacts.require("./AdriCoin.sol");

module.exports = function(deployer) {
    deployer.deploy(SampleContract);
    deployer.deploy(AdriCoin);
};
