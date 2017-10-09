var WitCoin = artifacts.require("./WitCoin.sol");
var CrowdSale = artifacts.require("./WitcoinCrowdsale.sol");

var crowdsale;
var coin;

var address1 = "0xAec3aE5d2BE00bfC91597d7A1b2c43818d84396A";
var address2 = "0xf1f42f995046E67b79DD5eBAfd224CE964740Da3";
var address3 = "0xcfe984b059de5fbfd8875e4a7e7a16298721b823";
var address4 = "0x2052d46d53107b0384503be3a11935f0b5cd5342";

contract('WitCoin', function(accounts) {

    var sender = accounts[0];

    it("Check initial values", function() {
        return WitCoin.deployed().then(function(instance) {
            coin = instance;
            return coin.balanceOf.call(sender);
        }).then(function(balance) {
            assert.equal(balance.valueOf(), 0, "0 wasn't in the first account");
            return coin.owner.call();
        }).then(function(result) {
            assert.equal(result, sender, "incorrect owner");
        });
    });

    it("Check mint", function() {
        return WitCoin.deployed().then(function (instance) {
            coin = instance;
            return coin.mint(address3, 10 * (Math.pow(10, 8)));
        }).then(function (result) {
            assert.equal(1, 2, "error onlyMinter");
        }).catch(function(e) {
            assert.equal(1, 1, "ok onlyMinter");
            return coin.changeMinter(sender, {from: address3});
        }).catch(function(e) {
            assert.equal(1, 1, "ok onlyOwner");
            return coin.changeMinter(sender, {from: sender});
        }).then(function (result) {
            return coin.mint(address3, 45 * (Math.pow(10, 8)));
        }).then(function (result) {
            return coin.balanceOf.call(address3);
        }).then(function (result) {
            assert.equal(result, 45 * (Math.pow(10, 8)), "unable to mint");
            return coin.totalSupply.call();
        }).then(function (result) {
            assert.equal(result, 45 * (Math.pow(10, 8)), "total supply error");
            return coin.mint(address2, 15 * (Math.pow(10, 8)));
        }).then(function (result) {
            return coin.balanceOf.call(address2);
        }).then(function (result) {
            assert.equal(result, 15 * (Math.pow(10, 8)), "unable to mint");
            return coin.totalSupply.call();
        }).then(function (result) {
            assert.equal(result, 60 * (Math.pow(10, 8)), "total supply error");
        });
    });

    it("Check ERC20 Approve", function() {
        return WitCoin.deployed().then(function (instance) {
            coin = instance;
            return coin.transferFrom(address3, address1, 10 * (Math.pow(10, 8)), {from: address2});
        }).then(function (result) {
            assert.equal(1, 2, "error not approved");
        }).catch(function(e) {
            return coin.approve(address2, 10 * (Math.pow(10, 8)), {from: address3});
        }).then(function (result) {
            return coin.transferFrom(address3, address1, 10 * (Math.pow(10, 8)), {from: address2});
        }).then(function (result) {
            return coin.balanceOf.call(address1);
        }).then(function (result) {
            assert.equal(result, 10 * (Math.pow(10, 8)), "transferFrom error");
            return coin.balanceOf.call(address3);
        }).then(function (result) {
            assert.equal(result, 35 * (Math.pow(10, 8)), "transferFrom error");
        });
    });

    it("Check ERC20 Approve Increase / Decrease", function() {
        var preBalance1 = 0;
        var preBalance3 = 0;
        return WitCoin.deployed().then(function (instance) {
            coin = instance;
            return coin.balanceOf.call(address1);
        }).then(function (result) {
            preBalance1 = result * 1;
            return coin.balanceOf.call(address3);
        }).then(function (result) {
            preBalance3 = result * 1;
            return coin.approve(address2, 10 * (Math.pow(10, 8)), {from: address3});
        }).then(function (result) {
            return coin.decreaseApproval(address2, 8 * (Math.pow(10, 8)), {from: address3});
        }).then(function (result) {
            return coin.transferFrom(address3, address1, 3 * (Math.pow(10, 8)), {from: address2});
        }).then(function (result) {
            assert.equal(1, 2, "decreaseApproval ignored");
        }).catch(function(e) {
            return coin.increaseApproval(address2, 3 * (Math.pow(10, 8)), {from: address3});
        }).then(function (result) {
            return coin.transferFrom(address3, address1, 7 * (Math.pow(10, 8)), {from: address2});
        }).then(function (result) {
            assert.equal(1, 2, "increaseApproval ignored");
        }).catch(function(e) {
            return coin.transferFrom(address3, address1, 5 * (Math.pow(10, 8)), {from: address2});
        }).then(function (result) {
            return coin.balanceOf.call(address1);
        }).then(function (result) {
            assert.equal(result * 1, preBalance1 + 5 * (Math.pow(10, 8)), "decreaseApproval / increaseApproval error account 1");
            return coin.balanceOf.call(address3);
        }).then(function (result) {
            assert.equal(result * 1, preBalance3 - 5 * (Math.pow(10, 8)), "decreaseApproval / increaseApproval error account 3");
        });
    });

    /*
    BALANCES:
     A1: 15
     A2: 15
     A3: 30
     A4: 0
    */

    it("check valid transfers", function() {
        return WitCoin.deployed().then(function (instance) {
            coin = instance;
            return coin.transfer(address4, 20 * (Math.pow(10, 8)), {from: address1});
        }).then(function (result) {
            assert.equal(1, 2, "not enough founds");
        }).catch(function(e) {
            assert.equal(1, 1, "not enough founds");
            return coin.transfer(address4, 15 * (Math.pow(10, 8)), {from: address3});
        }).then(function (result) {
            return coin.balanceOf(address4);
        }).then(function (result) {
            assert.equal(result, 15 * Math.pow(10, 8), "transaction error");
        });
    });

    it("check transfer to contract avoided", function() {
        return WitCoin.deployed().then(function (instance) {
            coin = instance;
            return CrowdSale.deployed().then(function (ins2) {
                crowdsale = ins2;
                return coin.transfer(CrowdSale.address, 15 * Math.pow(10, 8));
            }).catch(function (e) {
                return coin.balanceOf.call(CrowdSale.address);
            }).then(function (result) {
                assert.equal(result, 0, "transfer to contract accepted");
            });
        });
    });

});
