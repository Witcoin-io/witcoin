var WitCoin = artifacts.require("./WitCoin.sol");
var CrowdSale = artifacts.require("./WitcoinCrowdsale.sol");
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

function printTokensSold() {
    promises.push(crowdsale.tokensSold.call().then(function(result) {
        console.log("Tokens Sold: " + DecimalsToWitcoins(result));
    }));
}

function Buy(ether) {
    promises.push(crowdsale.send(EtherToWei(ether)).then(function(result) {
        console.log("Buying tokens through ether transfer");
        console.log("Gas consumed: " + result.receipt.gasUsed);
        return crowdsale.tokensSold.call().then(function(result) {
            console.log("Tokens Sold: " + DecimalsToWitcoins(result));
        });
    }).catch(function(e) {
        if (e.message.indexOf("sender doesn't have enough funds") > -1) console.log("Sender doesn't have enough funds");
        else console.log(e);
    }));
}

function Buy(ether,account) {
    promises.push(crowdsale.send(EtherToWei(ether), {from: account}).then(function(result) {
        console.log("Buying tokens through ether transfer");
        console.log("Gas consumed: " + result.receipt.gasUsed);
        return crowdsale.tokensSold.call().then(function(result) {
            console.log("Tokens Sold: " + DecimalsToWitcoins(result));
        });
    }).catch(function(e) {
        if (e.message.indexOf("sender doesn't have enough funds") > -1) console.log("Sender doesn't have enough funds");
        else console.log(e);
    }));
}

function BuyAlterCoin(address, witcoins) {
    promises.push(crowdsale.buyTokensAltercoins(address, WitcoinsToDecimals(witcoins)).then(function(result) {
        console.log("Buying "+witcoins+" tokens with altercoins");
        console.log("Gas consumed: " + result.receipt.gasUsed);
        return crowdsale.tokensSold.call().then(function(result) {
            console.log("Tokens Sold: " + DecimalsToWitcoins(result));
        });
    }).catch(function(e) {
        if (e.message.indexOf("invalid opcode") > -1) console.log("Not a valid purchase");
        else console.log(e);
    }));
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

function printBalance(account) {
    Promise.all(promises).then(function(){
        console.log("Balance of " + account + " = " + WeiToEther(web3.eth.getBalance(account)) + " ether");
    })
}

module.exports = function(callback) {
    var eventCall;

    // Pre deployed contract
    WitCoin.deployed().then(function(instance) {
        coin = instance;
        CrowdSale.deployed().then(function(ins2) {
            crowdsale = ins2;

            eventCall = crowdsale.TokenPurchase({value: "value", amount: "amount"});
            eventCall.watch(function(error, response) {
                console.log("Event: [Invested: "+response.args.value+", Tokens: "+response.args.amount + "]");
            });

            /*var accounts;
            web3.eth.getAccounts(function(err,res) { accounts = res; });
            console.log(accounts);
            var account1 = accounts[0];
            var account2 = accounts[1];
            var account3 = accounts[2];*/

            printBalance(address1);
            printBalance(address2);
            printBalance(address3);
            printBalance(real_address);

            promises.push(crowdsale.presale.call().then(function(result) {
                console.log("Presale time? " + result);
            }));
            promises.push(crowdsale.sale.call().then(function(result) {
                console.log("Sale time? " + result);
            }));
            promises.push(crowdsale.finalized.call().then(function(result) {
                console.log("Finalized? " + result);
            }));
            printTokensSold();

            // Buy 1 ether = 880 witcoins (+bonus)
            Buy(1);

            // Buy 2 ethers = 880*2 witcoins (+bonus)
            Buy(2);

            //Buy(2, address2);

            // Buy from altercoins 100 witcoins
            BuyAlterCoin(address1, 100);

            // Buy 2000 ether -> not enough funds in wallet
            Buy(2000);

            // Buy from altercoins 50 witcoins -> error because the minimum is 100
            BuyAlterCoin(address1, 50);

            // Buy from altercoins 100000 witcoins -> error because overpasses the crowdsale witcoins limit
            BuyAlterCoin(address1, 1000000);

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

            // Finally
            Promise.all(promises).then(function(){
                eventCall.stopWatching();
            })
        });
    });

};