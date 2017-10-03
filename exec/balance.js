var WitCoin = artifacts.require("./WitCoin.sol");

module.exports = function(callback) {
    var coin;

    // Pre deployed contract
    WitCoin.deployed().then(function(instance) {
        return instance.balanceOf("0x5282459151cf4f906a5ec46a8a42403e518d8edd");
    }).then(function(tx) {
        console.log(tx);
    }).catch(function(e) {
        console.log("ERROR");
        console.log(e);
    });

};
