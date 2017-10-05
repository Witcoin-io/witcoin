var CrowdSale = artifacts.require("./WitcoinCrowdsale.sol");
var WitCoin = artifacts.require("./WitCoin.sol");

var Utils = require("../lib//util.js");
var readline = require('readline');
var fs = require('fs');

module.exports = function(callback) {

    var EthPrice = 240;

    var instances = {
        coin: WitCoin,
        crowdsale: CrowdSale
    };

    // Deploy multiple contracts and parse its returned deployed instances
    Utils.deployMultiple(instances).then(function (deployed) {
        instances = Utils.parseDeployed(instances, deployed);

        // Read File
        var rd = readline.createInterface({input: fs.createReadStream('payments.txt'), console: false });

        // Parse donations
        var donations = [];
        rd.on('line', function(line) {
            var parts = line.split(";");
            if (parts.length !== 2) callback("Error parsing line: " + line);
            var address = parts[0];
            var amount = parseFloat(parts[1]) * Math.pow(10, 8);
            donations.push({address: address, amount: amount});
        });


        // End read file
        rd.on('close', function() {
            var preBalance = web3.eth.getBalance("0xAec3aE5d2BE00bfC91597d7A1b2c43818d84396A");
            console.log("All OK, start transactions.\n");

            // Make transactions
            var promises = [];
            var totalWitcoins = 0;
            var totalWitcoinsBonus = 0;
            donations.forEach(function(item){
                // console.log(item.address + " - " + item.amount);
                if (!web3.isAddress([item.address])) return;
                var before, after;
                promises.push(instances.coin.balanceOf.call(item.address).then(function(result) {
                    before = result;
                    return instances.crowdsale.validPurchase.call(item.amount).then(function(valid){
                        if (valid) {
                            return instances.crowdsale.buyTokensAltercoins(item.address, item.amount).then(function(tx){
                                totalWitcoins += item.amount /  Math.pow(10, 8);
                                return instances.coin.balanceOf.call(item.address).then(function(result) {
                                    after = result;
                                    totalWitcoinsBonus += (after - before) /  Math.pow(10, 8);
                                    if ((after - before) /  Math.pow(10, 8) !== 0) {
                                        console.log("Minted " + (after - before) /  Math.pow(10, 8) + " to " + item.address);
                                    }
                                });
                            });
                        } else {
                            console.log("Error in amount " + item.amount + " to " + item.address);
                        }
                    })
                }).catch(function(e) {
                    // console.log(e);
                    console.log("Unrecognized Error in address " + item.address);
                }));
            });

            // Finished all transactions
            Promise.all(promises).then(function(){
                var postBalance = web3.eth.getBalance("0xAec3aE5d2BE00bfC91597d7A1b2c43818d84396A");
                var ether = (preBalance - postBalance) / Math.pow(10, 18);
                console.log("\nFinished all transactions.");
                console.log("    Transactions Ether cost:       " + ether + " Eth");

                console.log("    Total WitCoins (no bonus):     " + totalWitcoins   + " Wit");
                console.log("    Total WitCoins (bonus):        " + totalWitcoinsBonus  + " Wit");

                console.log("    EUR cost (1Eth = " + EthPrice + "€):        " + Math.round(ether * EthPrice * 100) / 100 + " €");
                console.log("    EUR received (1Wit = " + Math.round(EthPrice / 880 * 100) / 100 + "€):   " + (Math.round(totalWitcoins / 880 * EthPrice * 100) / 100)  + " €");
            });

        });

    });

};
