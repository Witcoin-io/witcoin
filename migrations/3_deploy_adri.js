var AdriPlatform = artifacts.require("./AdriPlatform.sol");
// var EasyCoinInterface = artifacts.require("./EasyCoinInterface.sol");
var AdriCoin = artifacts.require("./AdriCoin.sol");
var VictorCoin = artifacts.require("./VictorCoin.sol");

module.exports = function(dd) {
    var deployer = dd;

    // deployer.deploy(EasyCoinInterface).then(function() {
        return deployer.deploy(AdriPlatform).then(function() {
            return deployer.deploy(AdriCoin).then(function() {
                return deployer.deploy(VictorCoin);
            })
        })
    // });

};
