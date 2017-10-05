var request = require('request');

module.exports = function(callback) {


     // BY TRANSACTION HASH

    var tx = "bc716694cc0feb3d0f0d860cac56bf0e7ecce06be391df921be5a348fd338fa6";
    request('https://blockexplorer.com/api/tx/' + tx, function (error, response, body) {
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
