let WitCoin = artifacts.require("./WitCoin.sol");
let WitcoinCrowdsale = artifacts.require("./WitcoinCrowdsale.sol");

let Utils = require("../lib//util.js");
let BitcoinParser = require("../lib/parsers/BitcoinParser.js");
let BitcoinCashParser = require("../lib/parsers/BitcoinCashParser.js");
let LitecoinParser = require("../lib/parsers/LitecoinParser.js");
let DashParser = require("../lib/parsers/DashParser.js");
let BancorParser = require("../lib/parsers/BancorParser.js");
let AragonParser = require("../lib/parsers/AragonParser.js");

module.exports = function(callback) {

    var sender = "0xAec3aE5d2BE00bfC91597d7A1b2c43818d84396A";

    var instances = {
        coin: {
            contract: WitCoin,
            address: "0x45c7eab211aa0d2ebd07a2ec8fe73bb337792d30"
            // address: "0x9e7e5b5651e826B301A9567a5Bb950a42bb17904"
        },
        crowdsale: {
            contract: WitcoinCrowdsale,
            address: "0xefc8fa44012e277bf750c52ec21709daf97f5273"
            // address: "0x85E49AD719a539fb9fBb1dfe0ce9A2cc184D5C9f"
        }
    };

    function getSpecificParser(coin){
        var parser;
        if (coin === "BTC") {
            parser = new BitcoinParser();
        } else if (coin === "BCH") {
            parser = new BitcoinCashParser();
        } else if (coin === "LTC") {
            parser = new LitecoinParser();
        } else if (coin === "DASH") {
            parser = new DashParser();
        } else if (coin === "BNT") {
            parser = new BancorParser();
        } else if (coin === "ANT") {
            parser = new AragonParser();
        }
        return parser;
    }

    function payAlterCoins(id, receiver, amount){
        if (!web3.isAddress(receiver)) {
            console.log("Error in address " + receiver + ". ID: " + id);
            return;
        }
        var before, after, gas;
        var preBalance = web3.eth.getBalance(sender);
        return instances.coin.balanceOf.call(receiver).then(function(result) {
            before = result;
            return instances.crowdsale.validPurchaseBonus.call(amount).then(function(valid){
                if (valid) {
                    return instances.crowdsale.buyTokensAltercoins(receiver, amount).then(function(tx){
                        gas = tx.receipt.gasUsed;
                        return instances.coin.balanceOf.call(receiver).then(function(result) {
                            after = result;
                            if ((after - before) /  Math.pow(10, 8) !== 0) {
                                var postBalance = web3.eth.getBalance(sender);
                                var ether = (preBalance - postBalance) / Math.pow(10, 18);
                                console.log("Minted " + (after - before) /  Math.pow(10, 8) + " to " + receiver + ".");
                                console.log("  Consumed " + gas + " gas");
                                console.log("  Cost " + ether + " Eth");
                            } else {
                                console.log("Error, minted 0 witcoins in address: " + receiver + ". ID: " + id);
                            }
                        });
                    });
                } else {
                    console.log("Error in amount " + amount + " to " + receiver + ". ID: " + id);
                }
            })
        }).catch(function(e) {
            console.log("Unrecognized Error in address " + receiver + ". ID: " + id);
        })
    }

    // Deploy multiple contracts and parse its returned deployed instances
    Utils.atMultiple(instances).then(function (deployed) {
        instances = Utils.parseDeployed(instances, deployed);

        var promises = [];

        // TODO GET ONE FROM DATABASE

        var value = 10039434160; // 10.3
        var receiver = "0xda3854011322eF11d1104b30842603Ab5a6D7698";
        var coin = "BNT";
        var id = 10;

        // END TODO

        var parser = getSpecificParser(coin);
        var amount = parser.convertToWitCoins(value);

        promises.push(payAlterCoins(id, receiver, amount));

        Promise.all(promises).then(function(){
            // TODO close DB
            console.log("FINISHED");
        });

    });

};
