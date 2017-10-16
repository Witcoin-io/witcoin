let CryptoParser = require('./CryptoParser.js');

/**
 * Created by Adrià on 03/10/2017.
 */
class BitcoinCashParser extends CryptoParser {

    constructor() {
        super();
        this.rate = 1400;
        this.decimals = 8;
        this.confirmations_needed = 6;
        if (this.real) {
            this.real_address = "1Px8jktJ3hKqQ8towTiSDXqerek3x2x1Pe";
        } else {
            this.real_address = "17Wk4GPKw9nZ9PbspzaxN3fv1L2m9NA9dg"; // TEST
        }
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
        return "https://bitcoincash.blockexplorer.com/api/tx/" + tx;
    }

    /**
     * ADDRESS API
     */

    getAdrApiUrl(){
        return "https://bitcoincash.blockexplorer.com/api/addr/" + this.real_address;
    }

    getTransactions(parsed) {
        var txs = [];
        parsed.transactions.forEach(function(tx){
            txs.push(tx);
        });
        return txs;
    }

}

module.exports = BitcoinCashParser;