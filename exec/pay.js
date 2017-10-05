var CrowdSale = artifacts.require("./WitcoinCrowdsale.sol");
var WitCoin = artifacts.require("./WitCoin.sol");

var Utils = require("../lib//util.js");
var readline = require('readline');
var fs = require('fs');

module.exports = function(callback) {

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
            var amount = parts[1];
            if (address.length !== 42) callback("Address length error: " + address);
            donations.push({address: address, amount: amount});
        });

        // End read file
        rd.on('close', function() {
            console.log("All OK, start transactions.");

            // Make transactions
            donations.forEach(function(item){
                instances.coin.balanceOf.call(item.address).then(function(result) {
                    console.log("Balance: " + result);
                });
                instances.crowdsale.buyTokensAltercoins("0x5282459151cf4f906a5ec46a8a42403e11111111", 10000000000).then(function(tx) {
                    console.log("Gas: " + tx.receipt.gasUsed);
                });

                // 0x5282459151cf4f906a5ec46a8a42403e11111111;10000000000

                instances.coin.balanceOf.call(item.address).then(function(result) {
                    console.log("Balance: " + result);
                });
            });
        });

    }).catch(function(e) {
        console.log(e);
    });

};
