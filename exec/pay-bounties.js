let WitCoin = artifacts.require("./WitCoin.sol");

var readline = require('readline');
var fs = require('fs');

let Utils = require("../lib//util.js");

module.exports = function(callback) {

    var sender = "0xAec3aE5d2BE00bfC91597d7A1b2c43818d84396A";

    var EthPrice = 280;

    // var instances = {
    //     coin: {
    //         contract: WitCoin,
    //         address: "0x9e7e5b5651e826B301A9567a5Bb950a42bb17904" // REAL
    //     },
    // };

    var instances = {
        coin: WitCoin
    };

    // Deploy multiple contracts and parse its returned deployed instances
    Utils.deployMultiple(instances).then(function (deployed) {
        instances = Utils.parseDeployed(instances, deployed);

        // Read File
        var rd = readline.createInterface({input: fs.createReadStream('bounties.txt'), console: false });

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
            var preBalance = web3.eth.getBalance(sender);
            console.log("All OK, start bounties payments.\n");

            // Make transactions
            var promises = [];
            var totalWitcoins = 0;
            donations.forEach(function(item){
                if (!web3.isAddress(item.address)) {
                    console.log("Error in address " + item.address);
                    return;
                }
                var before, after, gas;
                promises.push(instances.coin.balanceOf.call(item.address).then(function(result) {
                    before = result;
                    return instances.coin.transfer(item.address, item.amount).then(function(tx){
                        gas = tx.receipt.gasUsed;
                        return instances.coin.balanceOf.call(item.address).then(function(result){
                            after = result;
                            if ((after - before) /  Math.pow(10, 8) !== 0) {
                                totalWitcoins += (after - before) /  Math.pow(10, 8);
                                console.log("Payed " + (after - before) /  Math.pow(10, 8) + " to " + item.address + ", consumed " + gas + " gas");
                            } else {
                                console.log("Error, payed 0 witcoins in address: " + item.address);
                            }
                        });
                    })
                }).catch(function(e) {
                    // console.log(e);
                    console.log("Unrecognized Error in address " + item.address);
                }));
            });

            // Finished all transactions
            Promise.all(promises).then(function(){
                var postBalance = web3.eth.getBalance(sender);
                var ether = (preBalance - postBalance) / Math.pow(10, 18);
                console.log("\nFinished all transactions.");
                console.log("    Transactions Ether cost:  " + ether + " Eth");

                console.log("    Total WitCoins:           " + totalWitcoins   + " Wit");

                console.log("    EUR cost (1Eth = " + EthPrice + "€):   " + Math.round(ether * EthPrice * 100) / 100 + " €");
            });
        });

    });

};
