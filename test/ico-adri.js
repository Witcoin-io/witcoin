var Utils = require("../lib//util.js");

var WitCoin = artifacts.require("./token/WitCoin.sol");
var WitcoinCrowdSale = artifacts.require("./crowdsale/WitcoinCrowdsale.sol");

contract('WitcoinCrowdSale', function(accounts) {
    var sender = accounts[0];

    function EtherToWei(val) {
        return 1000000000000000000*val;
    }

    it("Initial Values", function() {
        var crowdsale, coin;
        return WitcoinCrowdSale.deployed().then(function(ins1) {
            crowdsale = ins1;
            return WitCoin.deployed().then(function(ins1) {
                coin = ins1;

                // Start Test
                assert.equal(2, 2);

            });
        });
    });

    it("Buy Tokens", function() {
        var crowdsale, coin;
        return WitcoinCrowdSale.deployed().then(function(ins1) {
            crowdsale = ins1;
            return WitCoin.deployed().then(function(ins1) {
                coin = ins1;

                // Start Test

                return coin.balanceOf.call("0xAec3aE5d2BE00bfC91597d7A1b2c43818d84396A").then(function (preBalance){
                    console.log(preBalance);
                    return crowdsale.send(EtherToWei(50), {from: accounts[1]}).then(function(tx) {
                        return coin.balanceOf.call("0xAec3aE5d2BE00bfC91597d7A1b2c43818d84396A").then(function (postBalance){
                            console.log(postBalance);
                            assert.equal(preBalance, postBalance, "Balances are equal.");
                        });
                    });
                });

            });
        });
    });


});
