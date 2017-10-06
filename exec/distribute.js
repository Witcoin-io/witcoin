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
    }).catch(function(e) {
        if (e.message.indexOf("sender doesn't have enough funds") > -1) console.log("Sender doesn't have enough funds");
        else console.log(e);
    }));
    printTokensSold();
}

// function Buy(ether,account) {
//     promises.push(crowdsale.send(EtherToWei(ether), {from: account}).then(function(result) {
//         console.log("Buying tokens through ether transfer");
//         console.log("Gas consumed: " + result.receipt.gasUsed);
//     }).catch(function(e) {
//         if (e.message.indexOf("sender doesn't have enough funds") > -1) console.log("Sender doesn't have enough funds");
//         else console.log(e);
//     }));
//     printTokensSold();
// }

function BuyAlterCoin(address, witcoins) {
    promises.push(crowdsale.buyTokensAltercoins(address, WitcoinsToDecimals(witcoins)).then(function(result) {
        console.log("Buying "+witcoins+" tokens with altercoins");
        console.log("Gas consumed: " + result.receipt.gasUsed);
        //console.log(result.logs);
    }).catch(function(e) {
        if (e.message.indexOf("invalid opcode") > -1) console.log("Not a valid purchase");
        else console.log(e);
    }));
    printTokensSold();
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

function DistributeTokens() {
    promises.push(crowdsale.distributeTokens().then(function(result) {
        console.log("Distributed tokens");
        console.log("Gas consumed: " + result.receipt.gasUsed);
    }).catch(function(e) {
        if (e.message.indexOf("sender doesn't have enough funds") > -1) console.log("Sender doesn't have enough funds");
        else console.log(e);
    }));
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

            printTokensSold();
            Buy(5);
            DistributeTokens();

            // Finally
            Promise.all(promises).then(function(){
                eventCall.stopWatching();
            })
        });
    });

};