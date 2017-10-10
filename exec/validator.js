var request = require('request');

module.exports = function(callback) {


     // BY TRANSACTION HASH

    0x1F573D6Fb3F13d689FF844B4cE37794d79a7FF1C


    var confirmTransaction = function(coin, tx) {
        // Coin specific values
        var url = "";
        var valueParam = "";
        var confirmationsNeeded = 100;
        if (coin === "BTC") {
            url = "https://blockexplorer.com/api/tx/";
            valueParam = "valueOut";
            confirmationsNeeded = 6;
        } else if (coin === "BCH") {
            url = "https://bitcoincash.blockexplorer.com/api/tx/";
            valueParam = "valueOut";
            confirmationsNeeded = 6;
        } else if (coin === "LTC") {
            url = "https://chainz.cryptoid.info/ltc/api.dws?q=txinfo&t=";
            valueParam = "total_output";
            confirmationsNeeded = 6;
        } else if (coin === "DASH") {
            url = "https://chainz.cryptoid.info/dash/api.dws?q=txinfo&t=";
            valueParam = "total_output";
            confirmationsNeeded = 6;
        } else if (coin === "DASH") {
            url = "https://chainz.cryptoid.info/dash/api.dws?q=txinfo&t=";
            valueParam = "total_output";
            confirmationsNeeded = 6;
        }

        // Make request
        request(url + tx, function (error, response, body) {
            if (body === "Not found" || body === "{}") {
                console.log("NOT FOUND");
            } else if (!error && response.statusCode === 200) {
                var parsed = JSON.parse(body);
                if (parsed.confirmations && parsed.confirmations >= confirmationsNeeded) {
                    var value = parsed[valueParam];
                    console.log("CONFIRMED - " + value);
                } else {
                    console.log("PENDING - Confirmations: " + parsed.confirmations);
                }
            } else {
                console.log('ERROR');
            }
        });
    };

    var confirmTokenTransaction = function(coin, tx) {
        var url = "";
        var confirmationsNeeded = 12;
        if (coin === "ANT") {

        }
    };

    var coin = "LTC";
    var tx = "67859ae0983d13d128becbeeffc76106d11fe5198daefc040eef5136bbb87422";

    confirmTransaction(coin, tx);

};
