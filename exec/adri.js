var AdriPlatform = artifacts.require("./AdriPlatform.sol");
var AdriCoin = artifacts.require("./AdriCoin.sol");
var VictorCoin = artifacts.require("./VictorCoin.sol");

module.exports = function(callback) {
    var platform;
    var adri;
    var victor;

    // Pre deployed contract
    AdriPlatform.deployed().then(function(ins1) {
        platform = ins1;
        AdriCoin.deployed().then(function(ins2) {
            adri = ins2;
            VictorCoin.deployed().then(function(ins3) {
                victor = ins3;

                return platform.getCoinText.call();
            }).then(function(tx) {
                console.log(tx);
                return platform.setCoinText(adri.address);
            }).then(function(tx) {
                return platform.getCoinText.call();
            }).then(function(tx) {
                console.log(tx);
                return platform.setCoinText(victor.address);
            }).then(function(tx) {
                return platform.getCoinText.call();
            }).then(function(tx) {
                console.log(tx);
                callback();
            });

        });
    });
};