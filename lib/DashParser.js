let CryptoParser = require('./CryptoParser.js');

/**
 * Created by Adrià on 03/10/2017.
 */
class DashParser extends CryptoParser {

    constructor() {
        super();
        this.confirmations_needed = 6;
        this.real_address = "Xvs5oKeXYrsGJeM9tzjEkcJTNLfFvNi81u";
        // this.real_address = "XpvTSqVSJFntSDZtbVQ4DvYU9CWc49msiH"; // TEST
    }

    getTransactionValue(parsed){
        var value = 0;
        var receiver = this.real_address;
        parsed.outputs.forEach(function(out){
            if (out.addr === receiver) {
                value += out.amount * 1;
            }
        });
        return value;
    }

    getOriginAddresses(parsed){
        var origins = [];
        parsed.inputs.forEach(function(input){
            if (input.addr !== undefined){
                origins.push(input.addr);
            }
        });
        return origins;
    }

    getTxApiUrl(tx){
        return "https://chainz.cryptoid.info/dash/api.dws?q=txinfo&t=" + tx;
    }

    /**
     * ADDRESS API
     */

    getAdrApiUrl(adr){
        return "https://chain.so/api/v2/address/DASH/" + this.real_address;
    }

    getTransactions(parsed) {
        var txs = [];
        parsed.data.txs.forEach(function(tx){
            txs.push(tx.txid);
        });
        return txs;
    }

}

module.exports = DashParser;
