let request = require('request');

let BitcoinParser = require("./lib/parsers/BitcoinParser.js");
let BitcoinCashParser = require("./lib/parsers/BitcoinCashParser.js");
let LitecoinParser = require("./lib/parsers/LitecoinParser.js");
let DashParser = require("./lib/parsers/DashParser.js");
let BancorParser = require("./lib/parsers/BancorParser.js");
let AragonParser = require("./lib/parsers/AragonParser.js");

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

function validateTransaction(coin, tx) {
    var parser = getSpecificParser(coin);
    console.log(parser.getTxApiUrl(tx));

    request(parser.getTxApiUrl(tx), function (error, response, body, callback) {
        if (!error && response.statusCode === 200 && !parser.emptyBody(body)) {
            var parsed = JSON.parse(body);

            // Confirmations in blockchain
            if (parser.validTransaction(parsed)) {

                // Get value
                var value = parser.getTransactionValue(parsed);
                var integer = parser.toIntegerValue(value);

                // Get origin addresses
                var origin = parser.getOriginAddresses(parsed);

                // Get timestamp
                var time = parser.getTimestamp(parsed);

                // ALL OK
                console.log("CONFIRMED");
                console.log("  Value:   " + value);
                console.log("  Integer: " + integer);
                console.log("  Origin:  " + origin);
                console.log("  Time:    " + time);
            } else {
                console.log("PENDING - Confirmations: " + parser.getConfirmations(parsed));
            }
        } else {
            console.log("ERROR");
        }
    });
}

// validateTransaction("BTC", "a2afb522edeba67ae593c683154da45b231d59ffccd18806cec38ecd21994a2d");
// validateTransaction("BCH", "41efd209e31fe5e783079e333cb0a860e3e11e992fc4175f19ab40641cd1d0f7");
validateTransaction("LTC", "83b654f3070a8268a36c5ff60c6201fe242831818a30fda77c0662e141053244");
// validateTransaction("DASH", "158ce8015e45c50a524c26079719d026c010976206624ac834011226671b6226");
// validateTransaction("BNT", "0x2cab2892eea9695d815473511b0f3c8e6a9b57929a9bf079c028b3ed4b9c4e75");
// validateTransaction("ANT", "0x0596718ac8ab05bc963c2f2ae70887232fc8ef04fc6faeb97fba0ab367588ceb");
