/**
 * Created by Adrià on 03/10/2017.
 */

module.exports = {

    getTransactionValue: function(parsed, coin){
        var value = 0;
        if (coin in ["ANT", "BNT"]) {
            parsed.operations.forEach(function(operation){
                value += operation.value * 1;
            });
        } else if (coin in ["BTC", "BCH"]){
            value = parsed["valueOut"] * 1;
        } else if (coin in ["LTC", "DASH"]){
            value = parsed["total_output"] * 1;
        }
        return value;
    },

    validTransaction: function(parsed, coin){
        if (coin in ["ANT", "BNT"]) {
            parsed.operations.forEach(function(operation){
                if (coin === "ANT" && operation.tokenInfo.address !== "0x960b236A07cf122663c4303350609A66A7B288C0") {
                    return false;
                }
                if (coin === "BNT" && operation.tokenInfo.address !== "0x1F573D6Fb3F13d689FF844B4cE37794d79a7FF1C") {
                    return false;
                }
            });
            return parsed.confirmations && parsed.confirmations >= 12;
        } else {
            return parsed.confirmations && parsed.confirmations >= 6;
        }
    },

    validReceiver: function(parsed, coin){
        if (coin in ["ANT", "BNT"]) {
            return parsed.to === etherTokenAddress;
        } else if (coin in ["ANT", "BNT"]) {

        }

        return false;
    },

    getApiUrl: function(coin, tx){
        var url = "";
        if (coin === "BTC") {
            url = "https://blockexplorer.com/api/tx/" + tx;
        } else if (coin === "BCH") {
            url = "https://bitcoincash.blockexplorer.com/api/tx/" + tx;
        } else if (coin === "LTC") {
            url = "https://chainz.cryptoid.info/ltc/api.dws?q=txinfo&t=" + tx;
        } else if (coin === "DASH") {
            url = "https://chainz.cryptoid.info/dash/api.dws?q=txinfo&t=" + tx;
        } else if (coin === "BNT") {
            url = "https://api.ethplorer.io/getTxInfo/" + tx + "?apiKey=freekey";
        } else if (coin === "ANT") {
            url = "https://api.ethplorer.io/getTxInfo/" + tx + "?apiKey=freekey";
        }
        return url;
    }

};
