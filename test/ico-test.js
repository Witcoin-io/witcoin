var WitCoin = artifacts.require("./token/WitCoin.sol");
var CrowdSale = artifacts.require("./crowdsale/WitcoinCrowdsale.sol");

var crowdsale;
var coin;
var promises = [];

var address1 = "0xAec3aE5d2BE00bfC91597d7A1b2c43818d84396A";
var address2 = "0xf1f42f995046E67b79DD5eBAfd224CE964740Da3";
var address3 = "0x2052d46d53107b0384503be3a11935f0b5cd5342";
var real_address = "0x04CF6551a4e0810C32DedBd76228b715f2598A33";

function EtherToWei(val) {
    return 1000000000000000000*val;
}

function WeiToEther(val) {
    return val/1000000000000000000;
}

function WitcoinsToDecimals(val) {
    return 100000000*val;
}

function DecimalsToWitcoins(val) {
    return val/100000000;
}

function ClaimRefund() {
    promises.push(crowdsale.claimRefund().then(function(result) {
        console.log("Claimed refund");
        console.log("Gas consumed: " + result.receipt.gasUsed);
        //console.log(result.logs);
    }).catch(function(e) {
        if (e.message.indexOf("invalid opcode") > -1) console.log("cannot claim refund");
        else console.log(e);
    }));
}

function Finalize() {
    promises.push(crowdsale.finalize().then(function(result) {
        console.log("Finalized crowdsale");
        console.log("Gas consumed: " + result.receipt.gasUsed);
    }).catch(function(e) {
        if (e.message.indexOf("invalid opcode") > -1) console.log("cannot finalize");
        else console.log(e);
    }));
}

contract('WitCoin', function(accounts) {
    it("check initial balances", function() {
        return WitCoin.deployed().then(function(instance) {
            return instance.balanceOf.call(accounts[0]);
        }).then(function(balance) {
            assert.equal(balance.valueOf(), 0, "0 wasn't in the first account");
        });
    });

    it("check initial values", function() {
        return WitCoin.deployed().then(function (instance) {
            coin = instance;
            return CrowdSale.deployed().then(function (ins2) {
                crowdsale = ins2;
                return crowdsale.presale.call();
            }).then(function (result) {
                assert.equal(result, false, "error in presale time");
                return crowdsale.sale.call();
            }).then(function (result) {
                assert.equal(result, true, "error in sale time");
                return crowdsale.finalized.call();
            }).then(function (result) {
                assert.equal(result, false, "error in finalized call");
                return crowdsale.tokensSold.call();
            }).then(function (result) {
                assert.equal(result, 0);
            });
        });
    });

    it("check valid transfer ether", function() {
        return WitCoin.deployed().then(function (instance) {
            coin = instance;
            return CrowdSale.deployed().then(function (ins2) {
                crowdsale = ins2;
                return crowdsale.send(EtherToWei(1));
            }).then(function (result) {
                assert.equal(result.receipt.gasUsed > 0, true, "error in ether transaction 1");
                return crowdsale.send(EtherToWei(2));
            }).then(function (result) {
                assert.equal(result.receipt.gasUsed > 0, true, "error in ether transaction 2");
                return coin.balanceOf.call(accounts[0]);
            }).then(function(balance) {
                assert.equal(balance.valueOf(), 264000000000, "100 witcoins wasn't in the first account");
            });
        });
    });

    it("check invalid transfer ether", function() {
        return WitCoin.deployed().then(function (instance) {
            coin = instance;
            return CrowdSale.deployed().then(function (ins2) {
                crowdsale = ins2;
                return crowdsale.send(EtherToWei(2000));
            }).then(function (result) {
                assert.equal(1, 2, "error in ether transaction 2000");
            }).catch(function(e) {
                assert.equal(1, 1);
            });
        });
    });

    it("check valid transfer altercoins", function() {
        return WitCoin.deployed().then(function (instance) {
            coin = instance;
            return CrowdSale.deployed().then(function (ins2) {
                crowdsale = ins2;
                return crowdsale.buyTokensAltercoins(address2, WitcoinsToDecimals(100));
            }).then(function (result) {
                assert.equal(1, 1, "error in altercoin transaction");
                return coin.balanceOf.call(address2);
            }).catch(function(e) {
                assert.equal(1, 2, "error in altercoin transaction");
            }).then(function(balance) {
                assert.equal(balance.valueOf(), 10000000000, "100 witcoins wasn't in the first account");
            });
        });
    });

    it("check invalid transfer altercoins", function() {
        return WitCoin.deployed().then(function (instance) {
            coin = instance;
            return CrowdSale.deployed().then(function (ins2) {
                crowdsale = ins2;
                return crowdsale.buyTokensAltercoins(address2, WitcoinsToDecimals(50));
            }).then(function (result) {
                assert.equal(1, 2, "error in altercoin transaction");
            }).catch(function(e) {
                assert.equal(1, 1, "error in altercoin transaction");
                return coin.balanceOf.call(address2);
            }).then(function(balance) {
                assert.equal(balance.valueOf(), 10000000000, "100 witcoins wasn't in the first account");

                return crowdsale.buyTokensAltercoins(address3, WitcoinsToDecimals(8000000));
            }).then(function (result) {
                assert.equal(1, 2, "error in altercoin transaction");
            }).catch(function(e) {
                assert.equal(1, 1, "error in altercoin transaction");
                return coin.balanceOf.call(address3);
            }).then(function(balance2) {
                assert.equal(balance2.valueOf(), 0, "0 witcoins wasn't in the first account");
            });
        });
    });

    /*
    // Buy from altercoins 100 witcoins -> error because invalid address
    BuyAlterCoin(address1, 0);

    // Finalize crowdsale
    Finalize();

    promises.push(crowdsale.finalized.call().then(function(result) {
        console.log("Finalized? " + result);
    }));

    // Claim refund -> not possible because crowdsale has not finished
    ClaimRefund();

    printBalance(address1);
    printBalance(address2);
    printBalance(address3);
    printBalance(real_address);
    */

});
