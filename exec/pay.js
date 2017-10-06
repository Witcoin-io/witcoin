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
            amount = parseFloat(amount) * Math.pow(10, 8);
            if (amount < 100 * Math.pow(10, 8)) callback("Amount less than 100.");
            donations.push({address: address, amount: amount});
        });

        // End read file
        rd.on('close', function() {
            console.log("All OK, start transactions.\n");

            // Make transactions
            donations.forEach(function(item){
                // console.log(item.address + " - " + item.amount);
                var promises = [], before, after;
                promises.push(instances.coin.balanceOf.call(item.address).then(function(result) {
                    before = result;
                }));
                promises.push(instances.crowdsale.buyTokensAltercoins(item.address, item.amount));
                promises.push(instances.coin.balanceOf.call(item.address).then(function(result) {
                    after = result;
                }));

                Promise.all(promises).then(function(){
                    console.log("Transferred " + (after - before) + " to " + item.address);
                });
            });
        });

    }).catch(function(e) {
        console.log(e);
    });

};
