var WitcoinPlatform = artifacts.require("./WitcoinPlatform.sol");
var WitCoin = artifacts.require("./WitCoin.sol");

module.exports = function(callback) {
    var platform;
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
            return coin.approve(WitcoinPlatform.address, 2000 * Math.pow(10, 8));
        }).then(function(tx) {
            console.log("Aproved");
            return platform.register("0xAec3aE5d2BE00bfC91597d7A1b2c43818d84399a", mainAccount,
                                     "0xDbdaA17aa6a854fEE1E127e1917E0a98dad607d1","0xDbdaA17aa6a854fEE1E127e1917E0a98dad607d2","0xDbdaA17aa6a854fEE1E127e1917E0a98dad607d3","0xDbdaA17aa6a854fEE1E127e1917E0a98dad607d4", 1, 1);
        }).then(function(tx) {
            console.log("Firs wit");
            return platform.register("0xAec3aE5d2BE00bfC91597d7A1b2c43818d843aa3", mainAccount,
                                     "0xDbdaA17aa6a854fEE1E127e1917E0a98dad607d1","0xDbdaA17aa6a854fEE1E127e1917E0a98dad607d2","0xDbdaA17aa6a854fEE1E127e1917E0a98dad607d3","0xDbdaA17aa6a854fEE1E127e1917E0a98dad607d4", citations, level);
        }).then(function(tx) {
            console.log("Gas: " + tx.receipt.gasUsed);
        }).catch(function(e) {
            console.log("ERROR");
            eventInfo.stopWatching();
        });

    });

};
