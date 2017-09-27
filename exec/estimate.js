var fs = require('fs');
var WitcoinPlatform = artifacts.require("./WitcoinPlatform.sol");
var WitCoin = artifacts.require("./WitCoin.sol");

module.exports = function(callback) {
    var platform;
    var coin;
    var logger = fs.createWriteStream("estimations.txt", {
        flags: 'w'
    });

    var maxCitations = 3;
    var maxLevel = -1; // Until gas limit error

    var count = 0;
    var citations = 1;
    var level = 1;
    var mainAccount = "0xAec3aE5d2BE00bfC91597d7A1b2c43818d84396A";

    var converter = function(x) {
        if (x < 10) return "00" + x;
        else if (x < 100) return "0" + x;
        else return "" + x;
    };

    var nextCall = function(tx) {
        // Previous call
        var str = tx.receipt.gasUsed;
        // var str = "   " + level + " " + citations + " " + tx.receipt.gasUsed;
        if (citations === maxCitations) str = str + "\n";
        else str = str + " ; ";
        logger.write(str);

        // Update values
        count++;
        if (count % maxCitations === 0) level++;
        citations++;
        if (citations === (maxCitations + 1)) citations = 1;
        return platform.register("0xAec3aE5d2BE00bfC91597d7A1b2c43818d843" + converter(count), mainAccount,
                                    "0xDbdaA17aa6a854fEE1E127e1917E0a98dad607d1","0xDbdaA17aa6a854fEE1E127e1917E0a98dad607d2","0xDbdaA17aa6a854fEE1E127e1917E0a98dad607d3","0xDbdaA17aa6a854fEE1E127e1917E0a98dad607d4", citations, level);
    };

    // Pre deployed contract
    WitcoinPlatform.deployed().then(function(ins1) {
        platform = ins1;
        var eventInfo = platform.info({txt: "txt"}, {value: "value"});
        eventInfo.watch(function(error, response) { console.log("event received: "+response.args.txt+" Value: "+response.args.value); });
        WitCoin.deployed().then(function(ins2) {
            coin = ins2;
            return coin.approve(WitcoinPlatform.address, 2000 * Math.pow(10, 8));
        }).then(function(tx) {
            console.log("Aprove:    "+tx.receipt.gasUsed);
            return platform.register("0xAec3aE5d2BE00bfC91597d7A1b2c43818d84399a", mainAccount,
                                     "0xDbdaA17aa6a854fEE1E127e1917E0a98dad607d1","0xDbdaA17aa6a854fEE1E127e1917E0a98dad607d2","0xDbdaA17aa6a854fEE1E127e1917E0a98dad607d3","0xDbdaA17aa6a854fEE1E127e1917E0a98dad607d4", 1, 1);
        }).then(function(tx) {
            return platform.register("0xAec3aE5d2BE00bfC91597d7A1b2c43818d843" + converter(count), mainAccount, "0xDbdaA17aa6a854fEE1E127e1917E0a98dad607d1","0xDbdaA17aa6a854fEE1E127e1917E0a98dad607d2","0xDbdaA17aa6a854fEE1E127e1917E0a98dad607d3","0xDbdaA17aa6a854fEE1E127e1917E0a98dad607d4", citations, level);
        }).then(nextCall).then(nextCall).then(nextCall).then(nextCall)
            .then(nextCall).then(nextCall).then(nextCall).then(nextCall)
            .then(nextCall).then(nextCall).then(nextCall).then(nextCall)
            .then(nextCall).then(nextCall).then(nextCall).then(nextCall)
            .then(nextCall).then(nextCall).then(nextCall).then(nextCall)
            .catch(function(e) {
            console.log("ERROR");
            eventInfo.stopWatching();
        });

    });

};
