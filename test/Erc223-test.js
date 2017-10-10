var WitCoin = artifacts.require("./WitCoin.sol");
var CrowdSale = artifacts.require("./WitcoinCrowdsale.sol");
var SampleContract = artifacts.require("./SampleContract.sol");

var crowdsale;
var sample;
var coin;

var address1 = "0xAec3aE5d2BE00bfC91597d7A1b2c43818d84396A";
var address2 = "0xf1f42f995046E67b79DD5eBAfd224CE964740Da3";
var address3 = "0xcfe984b059de5fbfd8875e4a7e7a16298721b823";
var address4 = "0x2052d46d53107b0384503be3a11935f0b5cd5342";

contract('WitCoin', function(accounts) {

    var sender = accounts[0];

    it("check transfer to contract abort", function() {
        return WitCoin.deployed().then(function (instance) {
            coin = instance;
            return CrowdSale.deployed().then(function (ins2) {
                crowdsale = ins2;
                return coin.changeMinter(sender);
            }).then(function (result) {
                return coin.mint(sender, 15 * Math.pow(10, 8));
            }).then(function (result) {
                return coin.transfer(CrowdSale.address, 15 * Math.pow(10, 8));
            }).catch(function (e) {
                return coin.balanceOf.call(CrowdSale.address);
            }).then(function (result) {
                assert.equal(result, 0, "transfer to contract should not be accepted");
                return coin.balanceOf.call(sender);
            }).then(function (result) {
                assert.equal(result, 15 * Math.pow(10, 8), "sender balance incorrect");
            });
        });
    });

    it("check transfer to contract success", function() {
        return WitCoin.deployed().then(function (instance) {
            coin = instance;
            return SampleContract.deployed().then(function (ins2) {
                sample = ins2;
                return sample.sender.call();
            }).then(function (result) {
                assert.equal(result, 0x0, "initial sender");
                return coin.balanceOf.call(sender);
            }).then(function (result) {
                assert.equal(result * 1, 15 * Math.pow(10, 8), "initial witcoins");
                return coin.transfer(SampleContract.address, 10 * Math.pow(10, 8));
            }).then(function (result) {
                return coin.balanceOf.call(SampleContract.address);
            }).then(function (result) {
                assert.equal(result * 1,  10 * Math.pow(10, 8), "transfer to contract accepted");
                return sample.sender.call();
            }).then(function (result) {
                assert.equal(result, sender, "last sender");
            });
        });
    });

});
