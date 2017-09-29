var WitcoinPlatform = artifacts.require("./WitcoinPlatform.sol");
var WitcoinFactory = artifacts.require("./WitcoinFactory.sol");
var WitCoin = artifacts.require("./WitCoin.sol");

module.exports = function(callback) {
    var platform;
    var factory;
    var coin;

    var citations = 3;
    var level = 3;
    var mainAccount = "0xAec3aE5d2BE00bfC91597d7A1b2c43818d84396A";

    // Pre deployed contract
    WitcoinPlatform.deployed().then(function(ins1) {
        platform = ins1;
        var eventInfo = platform.info({txt: "txt"}, {value: "value"});
        // eventInfo.watch(function(error, response) { console.log("event received: "+response.args.txt+" Value: "+response.args.value); });
        WitCoin.deployed().then(function(ins2) {
            coin = ins2;
            WitcoinFactory.deployed().then(function(ins3) {
                factory = ins3;
                return coin.approve(WitcoinPlatform.address, 2000 * Math.pow(10, 8));
            }).then(function(tx) {
                console.log("Aproved");
                return factory.CreateWit1(mainAccount, "0xDbdaA17aa6a854fEE1E127e1917E0a98dad607d1", "0xDbdaA17aa6a854fEE1E127e1917E0a98dad607d2", "0xDbdaA17aa6a854fEE1E127e1917E0a98dad607d3", "0x0");
            }).then(function(tx) {
                console.log("Wit Created: " + tx.receipt.gasUsed);
                var witAddress = 0x0;
                tx.logs.forEach(function(log) {
                    if (log.event === "WitCreated" && log.args.txt === "address") {
                        witAddress = log.args.value;
                    }
                });
                return platform.registerWit(witAddress, citations, level);
            }).then(function(tx) {
                console.log("Register:    " + tx.receipt.gasUsed);
            }).catch(function(e) {
                console.log("ERROR");
                console.log(e);
                // eventInfo.stopWatching();
            });
        });

    });

};
