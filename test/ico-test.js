var WitCoin = artifacts.require("./WitCoin.sol");
var CrowdSale = artifacts.require("./WitcoinCrowdsale.sol");

var crowdsale;
var coin;
var promises = [];

var address1 = "0xAec3aE5d2BE00bfC91597d7A1b2c43818d84396A";
var address2 = "0xf1f42f995046E67b79DD5eBAfd224CE964740Da3";
var address3 = "0x2052d46d53107b0384503be3a11935f0b5cd5342";
var bounties = "0x057Afd5422524d5Ca20218d07048300832323360";
var nirvana = "0x094d57AdaBa2278de6D1f3e2F975f14248C3775F";
var team = "0x7eC9d37163F4F1D1fD7E92B79B73d910088Aa2e7";
var club = "0xb2c032aF1336A1482eB2FE1815Ef301A2ea4fE0A";
var receiver = "0x04CF6551a4e0810C32DedBd76228b715f2598A33";

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

function AddDays(date, days) {
    return date+days*86400;
}

contract('WitCoin', function(accounts) {
    var today = parseInt(new Date().getTime()/1000);
    var initial_ether = WeiToEther(web3.eth.getBalance(address1).valueOf());
    var initial_ether_receiver = WeiToEther(web3.eth.getBalance(receiver).valueOf());

    // Presale time
    it("set initial testing parameters", function() {
        return CrowdSale.deployed().then(function(instance1) {
            crowdsale = instance1;
            var startPresale = AddDays(today, -1);
            var startSale = AddDays(today, 1);
            var end = AddDays(today, 10);
            var endRefund = AddDays(today, 20);
            return crowdsale.ChangeParameters(startSale, startPresale, end, endRefund, WitcoinsToDecimals(1000000));
        }).catch(function(e) {
            console.log(e);
            assert.equal(1, 2);
        });
    });

    it("check crowdsale values", function() {
        return WitCoin.deployed().then(function (instance) {
            coin = instance;
            return CrowdSale.deployed().then(function (ins2) {
                crowdsale = ins2;
                return crowdsale.presale.call();
            }).then(function (result) {
                assert.equal(result, true, "error in presale time");
                return crowdsale.sale.call();
            }).then(function (result) {
                assert.equal(result, false, "error in sale time");
                return crowdsale.finalized.call();
            }).then(function (result) {
                assert.equal(result, false, "error in finalized call");
                return crowdsale.tokensSold.call();
            }).then(function (result) {
                assert.equal(result.valueOf(), 0);
            }).catch(function(e) {
                console.log(e);
                assert.equal(1, 2);
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
                return coin.balanceOf.call(address1);
            }).then(function(balance) {
                assert.equal(balance.valueOf(), WitcoinsToDecimals(880)*1.3, "incorrect witcoins balance 1");
                return crowdsale.send(EtherToWei(2));
            }).then(function (result) {
                assert.equal(result.receipt.gasUsed > 0, true, "error in ether transaction 2");
                return coin.balanceOf.call(address1);
            }).then(function(balance) {
                assert.equal(balance.valueOf(), WitcoinsToDecimals(880*3)*1.3, "incorrect witcoins balance 2");
            }).catch(function(e) {
                console.log(e);
                assert.equal(1, 2);
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
                console.log(e);
                assert.equal(1, 2, "error in altercoin transaction");
            }).then(function(balance) {
                assert.equal(balance.valueOf(), WitcoinsToDecimals(100)*1.3, "incorrect witcoins balance");
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
                assert.equal(balance.valueOf(), WitcoinsToDecimals(100)*1.3, "incorrect witcoins balance");
            });
        });
    });

    it("check invalid transfer altercoins", function() {
        return WitCoin.deployed().then(function (instance) {
            coin = instance;
            return CrowdSale.deployed().then(function (ins2) {
                crowdsale = ins2;
                return crowdsale.finalize();
            }).then(function(result) {
                assert.equal(1, 2);
            }).catch(function(e) {
                assert.equal(e.message.indexOf("invalid opcode") > -1, true, "error in finalization");
                return crowdsale.finalized.call();
            }).then(function (result) {
                assert.equal(result, false, "error in finalized call");
                return crowdsale.tokensSold.call();
            });
        });
    });

    it("check claim refunds", function() {
        return WitCoin.deployed().then(function (instance) {
            coin = instance;
            return CrowdSale.deployed().then(function (ins2) {
                crowdsale = ins2;
                return crowdsale.claimRefund();
            }).then(function(result) {
                assert.equal(1, 2, "error in claim refund");
            }).catch(function(e) {
                assert.equal(e.message.indexOf("invalid opcode") > -1, true, "error in claim refund");
            });
        });
    });

    it("check balances", function() {
        return WitCoin.deployed().then(function (instance) {
            coin = instance;
            return CrowdSale.deployed().then(function (ins2) {
                crowdsale = ins2;
                var consumed_ether = initial_ether - WeiToEther(web3.eth.getBalance(address1).valueOf());
                assert.equal(WeiToEther(web3.eth.getBalance("0xAec3aE5d2BE00bfC91597d7A1b2c43818d84196A").valueOf()), 0);
                assert.equal(parseInt(consumed_ether), 3);
                assert.equal(WeiToEther(web3.eth.getBalance(address2).valueOf()), 1000);
                assert.equal(WeiToEther(web3.eth.getBalance(address3).valueOf()), 1000);
                assert.equal(WeiToEther(web3.eth.getBalance(address3).valueOf()), 1000);
                assert.equal(WeiToEther(web3.eth.getBalance(bounties).valueOf()), 0);
                assert.equal(WeiToEther(web3.eth.getBalance(nirvana).valueOf()), 0);
                assert.equal(WeiToEther(web3.eth.getBalance(team).valueOf()), 0);
                assert.equal(WeiToEther(web3.eth.getBalance(club).valueOf()), 0);
            });
        });
    });


    // Sale time
    it("set initial testing parameters", function() {
        return CrowdSale.deployed().then(function(instance1) {
            var startPresale = AddDays(today, -2);
            var startSale = AddDays(today, -1);
            var end = AddDays(today, 10);
            var endRefund = AddDays(today, 20);
            return crowdsale.ChangeParameters(startSale, startPresale, end, endRefund, WitcoinsToDecimals(1000000));
        }).catch(function(e) {
            console.log(e);
            assert.equal(1, 2);
        });
    });

    it("check crowdsale values", function() {
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
            }).then(function (resultx) {
                assert.equal(resultx.valueOf(), WitcoinsToDecimals(3562));
            }).catch(function(e) {
                console.log(e);
                assert.equal(1, 3);
            });
        });
    });

    it("check valid transfer ether", function() {
        return WitCoin.deployed().then(function (instance) {
            coin = instance;
            var balance1 = 0;
            return CrowdSale.deployed().then(function (ins2) {
                crowdsale = ins2;
                return coin.balanceOf.call(address1);
            }).then(function(balance) {
                balance1 = balance;
                return crowdsale.send(EtherToWei(1));
            }).then(function (result) {
                assert.equal(result.receipt.gasUsed > 0, true, "error in ether transaction 1");
                return coin.balanceOf.call(address1);
            }).then(function(balance) {
                balance1 = parseInt(balance1) + parseInt(WitcoinsToDecimals(880));
                assert.equal(balance.valueOf(), balance1, "incorrect witcoins balance 1");
                return crowdsale.send(EtherToWei(10));
            }).then(function (result) {
                assert.equal(result.receipt.gasUsed > 0, true, "error in ether transaction 1");
                return coin.balanceOf.call(address1);
            }).then(function(balance) {
                assert.equal(balance.valueOf(), parseInt(balance1) + parseInt(WitcoinsToDecimals(880*10*1.05)), "incorrect witcoins balance 2");
            }).catch(function(e) {
                console.log(e);
                assert.equal(1, 2);
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
                return crowdsale.buyTokensAltercoins(address3, WitcoinsToDecimals(100));
            }).then(function (result) {
                assert.equal(1, 1, "error in altercoin transaction");
                return coin.balanceOf.call(address3);
            }).catch(function(e) {
                assert.equal(1, 2, "error in altercoin transaction");
            }).then(function(balance) {
                assert.equal(balance.valueOf(), WitcoinsToDecimals(100), "incorrect witcoins balance");
                return crowdsale.buyTokensAltercoins(address3, WitcoinsToDecimals(100000));
            }).then(function (result) {
                assert.equal(1, 1, "error in altercoin transaction");
                return coin.balanceOf.call(address3);
            }).then(function(balance) {
                assert.equal(balance.valueOf(), parseInt(WitcoinsToDecimals(100000*1.1+100)), "incorrect witcoins balance");
            });
        });
    });

    it("check invalid transfer", function() {
        return WitCoin.deployed().then(function (instance) {
            coin = instance;
            return CrowdSale.deployed().then(function (ins2) {
                crowdsale = ins2;
                return crowdsale.send(EtherToWei(0.1));
            }).then(function (result) {
                assert.equal(1, 2, "error in transaction");
            }).catch(function(e) {
                assert.equal(e.message.indexOf("invalid opcode") > -1, true, "error in invalid transfer");
            });
        });
    });

    it("check claim refunds", function() {
        return WitCoin.deployed().then(function (instance) {
            coin = instance;
            return CrowdSale.deployed().then(function (ins2) {
                crowdsale = ins2;
                return crowdsale.claimRefund();
            }).then(function(result) {
                assert.equal(1, 2, "error in claim refund");
            }).catch(function(e) {
                assert.equal(e.message.indexOf("invalid opcode") > -1, true, "error in claim refund");
            });
        });
    });

    it("check balances", function() {
        return WitCoin.deployed().then(function (instance) {
            coin = instance;
            return CrowdSale.deployed().then(function (ins2) {
                crowdsale = ins2;
                assert.equal(WeiToEther(web3.eth.getBalance("0xAec3aE5d2BE00bfC91597d7A1b2c43818d84196A").valueOf()), 0);
                var consumed_ether = initial_ether - WeiToEther(web3.eth.getBalance(address1).valueOf());
                assert.equal(WeiToEther(web3.eth.getBalance("0xAec3aE5d2BE00bfC91597d7A1b2c43818d84196A").valueOf()), 0);
                assert.equal(parseInt(consumed_ether), 14);
                assert.equal(WeiToEther(web3.eth.getBalance(address2).valueOf()), 1000);
                assert.equal(WeiToEther(web3.eth.getBalance(address3).valueOf()), 1000);
                assert.equal(WeiToEther(web3.eth.getBalance(address3).valueOf()), 1000);
                assert.equal(WeiToEther(web3.eth.getBalance(bounties).valueOf()), 0);
                assert.equal(WeiToEther(web3.eth.getBalance(nirvana).valueOf()), 0);
                assert.equal(WeiToEther(web3.eth.getBalance(team).valueOf()), 0);
                assert.equal(WeiToEther(web3.eth.getBalance(club).valueOf()), 0);
            });
        });
    });



    // Finalize crowdsale goal not reached
    it("set initial testing parameters", function() {
        return CrowdSale.deployed().then(function(instance1) {
            var startPresale = AddDays(today, -4);
            var startSale = AddDays(today, -3);
            var end = AddDays(today, -2);
            var endRefund = AddDays(today, -1);
            return crowdsale.ChangeParameters(startSale, startPresale, end, endRefund, WitcoinsToDecimals(1000000));
        }).catch(function(e) {
            console.log(e);
            assert.equal(1, 2);
        });
    });

    it("check crowdsale values", function() {
        return WitCoin.deployed().then(function (instance) {
            coin = instance;
            return CrowdSale.deployed().then(function (ins2) {
                crowdsale = ins2;
                return crowdsale.presale.call();
            }).then(function (result) {
                assert.equal(result, false, "error in presale time");
                return crowdsale.sale.call();
            }).then(function (result) {
                assert.equal(result, false, "error in sale time");
                return crowdsale.finalized.call();
            }).then(function (result) {
                assert.equal(result, false, "error in finalized call");
                return crowdsale.finalize();
            }).then(function (result) {
                return crowdsale.finalized.call();
            }).then(function (result) {
                assert.equal(result, true, "error in finalized call");
            }).catch(function(e) {
                console.log(e);
                assert.equal(1, 3);
            });
        });
    });

    it("check valid transfer altercoins", function() {
        return WitCoin.deployed().then(function (instance) {
            coin = instance;
            return CrowdSale.deployed().then(function (ins2) {
                crowdsale = ins2;
                return crowdsale.buyTokensAltercoins(address3, WitcoinsToDecimals(200));
            }).then(function (result) {
                assert.equal(1, 2, "error in altercoin transaction");
                return coin.balanceOf.call(address3);
            }).catch(function(e) {
                assert.equal(1, 1, "error in altercoin transaction");
            });
        });
    });

    it("check claim refunds", function() {
        return WitCoin.deployed().then(function (instance) {
            coin = instance;
            return CrowdSale.deployed().then(function (ins2) {
                crowdsale = ins2;
                return crowdsale.claimRefund();
            }).then(function(result) {
                assert.equal(1, 2, "error in claim refund");
            }).catch(function(e) {
                assert.equal(1, 1, "error in claim refund");
            });
        });
    });

    it("check balances", function() {
        return WitCoin.deployed().then(function (instance) {
            coin = instance;
            return CrowdSale.deployed().then(function (ins2) {
                crowdsale = ins2;
                assert.equal(WeiToEther(web3.eth.getBalance("0xAec3aE5d2BE00bfC91597d7A1b2c43818d84196A").valueOf()), 0);
                var consumed_ether = initial_ether - WeiToEther(web3.eth.getBalance(address1).valueOf());
                assert.equal(WeiToEther(web3.eth.getBalance("0xAec3aE5d2BE00bfC91597d7A1b2c43818d84196A").valueOf()), 0);
                assert.equal(parseInt(consumed_ether), 0);
                assert.equal(WeiToEther(web3.eth.getBalance(address2).valueOf()), 1000);
                assert.equal(WeiToEther(web3.eth.getBalance(address3).valueOf()), 1000);
                assert.equal(WeiToEther(web3.eth.getBalance(address3).valueOf()), 1000);
                assert.equal(WeiToEther(web3.eth.getBalance(bounties).valueOf()), 0);
                assert.equal(WeiToEther(web3.eth.getBalance(nirvana).valueOf()), 0);
                assert.equal(WeiToEther(web3.eth.getBalance(team).valueOf()), 0);
                assert.equal(WeiToEther(web3.eth.getBalance(club).valueOf()), 0);
            });
        });
    });



    // Finalize crowdsale achieving goal
    it("set final testing parameters", function() {
        return CrowdSale.deployed().then(function(instance1) {
            var startPresale = AddDays(today, -4);
            var startSale = AddDays(today, -3);
            var end = AddDays(today, -2);
            var endRefund = AddDays(today, -1);
            return crowdsale.ChangeParameters(startSale, startPresale, end, endRefund, WitcoinsToDecimals(0));
        }).catch(function(e) {
            console.log(e);
            assert.equal(1, 2);
        });
    });

    it("check claim refunds", function() {
        return WitCoin.deployed().then(function (instance) {
            coin = instance;
            return CrowdSale.deployed().then(function (ins2) {
                crowdsale = ins2;
                return crowdsale.claimRefund();
            }).then(function(result) {
                assert.equal(1, 1, "error in claim refund");
            }).catch(function(e) {
                assert.equal(1, 2, "error in claim refund");
            });
        });
    });

    it("check balances", function() {
        return WitCoin.deployed().then(function (instance) {
            coin = instance;
            return CrowdSale.deployed().then(function (ins2) {
                crowdsale = ins2;
                assert.equal(WeiToEther(web3.eth.getBalance("0xAec3aE5d2BE00bfC91597d7A1b2c43818d84196A").valueOf()), 0);
                var consumed_ether = initial_ether - WeiToEther(web3.eth.getBalance(address1).valueOf());
                assert.equal(WeiToEther(web3.eth.getBalance("0xAec3aE5d2BE00bfC91597d7A1b2c43818d84196A").valueOf()), 0);
                assert.equal(parseInt(consumed_ether), 0);
                assert.equal(WeiToEther(web3.eth.getBalance(address2).valueOf()), 1000);
                assert.equal(WeiToEther(web3.eth.getBalance(address3).valueOf()), 1000);
                assert.equal(WeiToEther(web3.eth.getBalance(address3).valueOf()), 1000);
                assert.equal(WeiToEther(web3.eth.getBalance(bounties).valueOf()), 0);
                assert.equal(WeiToEther(web3.eth.getBalance(nirvana).valueOf()), 0);
                assert.equal(WeiToEther(web3.eth.getBalance(team).valueOf()), 0);
                assert.equal(WeiToEther(web3.eth.getBalance(club).valueOf()), 0);
                assert.equal(WeiToEther(web3.eth.getBalance(receiver).valueOf()), initial_ether_receiver);
            });
        });
    });

    it("finalize refunding", function() {
        return WitCoin.deployed().then(function (instance) {
            coin = instance;
            return CrowdSale.deployed().then(function (ins2) {
                crowdsale = ins2;
                return crowdsale.finalizeRefunding();
            }).then(function(result) {
                assert.equal(1, 1, "error in finalizing");
            }).catch(function(e) {
                assert.equal(1, 2, "error in finalizing");
            });
        });
    });

    it("check claim refunds", function() {
        return WitCoin.deployed().then(function (instance) {
            coin = instance;
            return CrowdSale.deployed().then(function (ins2) {
                crowdsale = ins2;
                return crowdsale.claimRefund();
            }).then(function(result) {
                assert.equal(1, 2, "error in claim refund");
            }).catch(function(e) {
                assert.equal(1, 1, "error in claim refund");
            });
        });
    });


    it("check balances", function() {
        return WitCoin.deployed().then(function (instance) {
            coin = instance;
            return CrowdSale.deployed().then(function (ins2) {
                crowdsale = ins2;
                assert.equal(WeiToEther(web3.eth.getBalance("0xAec3aE5d2BE00bfC91597d7A1b2c43818d84196A").valueOf()), 0);
                var consumed_ether = initial_ether - WeiToEther(web3.eth.getBalance(address1).valueOf());
                assert.equal(WeiToEther(web3.eth.getBalance("0xAec3aE5d2BE00bfC91597d7A1b2c43818d84196A").valueOf()), 0);
                assert.equal(parseInt(consumed_ether), 0);
                assert.equal(WeiToEther(web3.eth.getBalance(address2).valueOf()), 1000);
                assert.equal(WeiToEther(web3.eth.getBalance(address3).valueOf()), 1000);
                assert.equal(WeiToEther(web3.eth.getBalance(address3).valueOf()), 1000);
                assert.equal(WeiToEther(web3.eth.getBalance(bounties).valueOf()), 0);
                assert.equal(WeiToEther(web3.eth.getBalance(nirvana).valueOf()), 0);
                assert.equal(WeiToEther(web3.eth.getBalance(team).valueOf()), 0);
                assert.equal(WeiToEther(web3.eth.getBalance(club).valueOf()), 0);
                assert.equal(WeiToEther(web3.eth.getBalance(receiver).valueOf()), initial_ether_receiver);
            });
        });
    });

});
