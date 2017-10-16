let request = require('request');

let DataBase = require('./lib/DataBase');

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
    return (new Promise(function(resolve, reject) {
        var parser = getSpecificParser(coin);
        console.log(parser.getTxApiUrl(tx));

        request(parser.getTxApiUrl(tx), function (error, response, body, callback) {
            if (!error && response.statusCode === 200 && !parser.emptyBody(body)) {
                var parsed = JSON.parse(body);

                // Confirmations in BlockChain
                if (parser.validTransaction(parsed)) {

                    // Get value
                    var value = parser.getTransactionValue(parsed);
                    var integer = parser.toIntegerValue(value);

                    // Get origin addresses
                    var origin = parser.getOriginAddresses(parsed);

                    // Get timestamp
                    var time = parser.getTimestamp(parsed);

                    // ALL OK, Validate

                    database.validateTransaction(tx,coin,integer,origin,time);

                    // console.log("CONFIRMED");
                    // console.log("  Value:   " + value);
                    // console.log("  Integer: " + integer);
                    // console.log("  Origin:  " + origin);
                    // console.log("  Time:    " + time);

                    resolve(true);
                } else {
                    resolve(false);
                }
            } else {
                resolve(false);
            }
        });
    }));
}

var database = new DataBase({});
var promises = [];

database.getTransactions(function(rows){
    for(var i=0; i<rows.length; i++){
        var row = rows[i];
        promises.push(validateTransaction(row.coin, row.hash));
    }

    Promise.all(promises).then(function(){
        database.close();
    });
});
