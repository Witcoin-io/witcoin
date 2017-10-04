var WitCoin = artifacts.require("./WitCoin.sol");
var CrowdSale = artifacts.require("./WitcoinCrowdsale.sol");

function EtherToWei(val) {
    return 1000000000000000000*val;
}

module.exports = function(callback) {
    var coin;
    var crowdsale;
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

            crowdsale.presale.call().then(function(result) {
                console.log("Presale time? " + result);
            });
            crowdsale.sale.call().then(function(result) {
                console.log("Sale time? " + result);
            });
            crowdsale.tokensSold.call().then(function(result) {
                console.log("Tokens Sold: " + result);
            });

            crowdsale.send(EtherToWei(1)).then(function(result) {
                console.log("Bought tokens through ether transfer");
                console.log("Gas consumed: " + result.receipt.gasUsed);
            });
            crowdsale.tokensSold.call().then(function(result) {
                console.log("Tokens Sold: " + result);
            });

            crowdsale.send(EtherToWei(2)).then(function(result) {
                console.log("Bought tokens through ether transfer");
                console.log("Gas consumed: " + result.receipt.gasUsed);
            });
            crowdsale.tokensSold.call().then(function(result) {
                console.log("Tokens Sold: " + result);
            });

            crowdsale.send(EtherToWei(2000)).then(function(result) {
                console.log("Bought tokens through ether transfer");
                console.log("Gas consumed: " + result.receipt.gasUsed);
            }).catch(function(e) {
                if (e.message.indexOf("sender doesn't have enough funds") > -1) console.log("Sender doesn't have enough funds");
                else console.log(e);
            });

            crowdsale.tokensSold.call().then(function(result) {
                console.log("Tokens Sold: " + result);
            });

            crowdsale.buyTokensAltercoins(0xAec3aE5d2BE00bfC91597d7A1b2c43818d84396A, 10).then(function(result) {
                console.log("Bought tokens with altercoins");
                console.log("Gas consumed: " + result.receipt.gasUsed);
            });
            crowdsale.tokensSold.call().then(function(result) {
                console.log("Tokens Sold: " + result);
            });

            crowdsale.buyTokensAltercoins(0xAec3aE5d2BE00bfC91597d7A1b2c43818d84396A, 50).then(function(result) {
                console.log("Bought tokens with altercoins");
                console.log("Gas consumed: " + result.receipt.gasUsed);
            });

            crowdsale.tokensSold.call().then(function(result) {
                console.log("Tokens Sold: " + result);
                eventCall.stopWatching();
            });

        });
    });

};