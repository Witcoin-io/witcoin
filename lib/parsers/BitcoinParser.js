let CryptoParser = require('./CryptoParser.js');

/**
 * Created by Adrià on 03/10/2017.
 */
class BitcoinParser extends CryptoParser {

    constructor() {
        super();
        this.confirmations_needed = 6;
        this.real_address = "1Px8jktJ3hKqQ8towTiSDXqerek3x2x1Pe";
        // this.real_address = "16RfWPJJExk8iGS6WB3SEDRc72MFBYNUa5"; // TEST
    }

    getTransactionValue(parsed){
        var value = 0;
        var receiver = this.real_address;
        parsed.vout.forEach(function(out){
            if (out.scriptPubKey.addresses[0] === receiver) {
                value += out.value * 1;
            }
        });
        return value;
    }

    getOriginAddresses(parsed){
        var origins = [];
        parsed.vin.forEach(function(vin){
            if (vin.addr !== undefined){
                origins.push(vin.addr);
            }
        });
        return origins;
    }

    getTimestamp(parsed){
        return parsed.time;
    }

    getTxApiUrl(tx){
        return "https://blockexplorer.com/api/tx/" + tx;
    }

    /**
     * ADDRESS API
     */

    getAdrApiUrl(){
        return "https://blockexplorer.com/api/addr/" + this.real_address;
    }

    getTransactions(parsed) {
        var txs = [];
        parsed.transactions.forEach(function(tx){
            txs.push(tx);
        });
        return txs;
    }

}

module.exports = BitcoinParser;
