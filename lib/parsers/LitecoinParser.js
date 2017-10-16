let CryptoParser = require('./CryptoParser.js');

/**
 * Created by Adrià on 03/10/2017.
 */
class LitecoinParser extends CryptoParser {

    constructor() {
        super();
        this.rate = 150;
        this.decimals = 8;
        this.confirmations_needed = 6;
        if (this.real) {
            this.real_address = "LQtCS6w5ioxUkc1B9spbmJQeTtWo8EJeyx";
        } else {
            this.real_address = "LbonesBLEzxtah3UEAGHTLE9cnoEdixjDE"; // TEST
        }
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
        return "https://chainz.cryptoid.info/ltc/api.dws?q=txinfo&t=" + tx;
    }

    /**
     * ADDRESS API
     */

    getAdrApiUrl(adr){
        return "https://chain.so/api/v2/address/LTC/" + this.real_address;
    }

    getTransactions(parsed) {
        var txs = [];
        parsed.data.txs.forEach(function(tx){
            txs.push(tx.txid);
        });
        return txs;
    }

}

module.exports = LitecoinParser;
