var request = require('request');

module.exports = function(callback) {


     // BY TRANSACTION HASH

    var tx = "0a3de0b1534d3f54a086acb409efd9405347550ebb77c70a39c65b8aa48a914f";
    request('https://bitcoincash.blockexplorer.com/api/tx/' + tx, function (error, response, body) {
        if (body === "Not found") {
            console.log("NOT FOUND");
        } else if (!error && response.statusCode === 200) {
            var parsed = JSON.parse(body);
            if (parsed.confirmations && parsed.confirmations >= 6) {
                console.log("CONFIRMED - " + parsed.valueOut);
            } else {
                console.log("PENDING - Confirmations: " + parsed.confirmations);
            }
        } else {
            console.log('ERROR');
        }
    });

};
