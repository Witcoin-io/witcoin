let CryptoParser = require('./CryptoParser.js');

/**
 * Created by Adrià on 03/10/2017.
 */
class AragonParser extends CryptoParser {

    constructor() {
        super();
        this.confirmations_needed = 12;
        this.real_address = "0x04CF6551a4e0810C32DedBd76228b715f2598A33";
        // this.real_address = "0x7076bad37668917ea0840e75eb32326b0f0f5a8f"; // TEST
    }

    getTransactionValue(parsed){
        var value = 0;
        var receiver = this.real_address;
        parsed.operations.forEach(function(operation){
            if (operation.to === receiver) {
                value += operation.value * 1 / Math.pow(10, 18);
            }
        });
        return value;
    }

    getOriginAddresses(parsed){
        var origins = [];
        parsed.operations.forEach(function(operation){
            if (operation.to !== undefined) {
                origins.push(operation.to);
            }
        });
        return origins;
    }

    getTxApiUrl(tx){
        return "https://api.ethplorer.io/getTxInfo/" + tx + "?apiKey=freekey";
    }

    /**
     * ADDRESS API
     */

    getAdrApiUrl(){
        var antToken = "0x960b236A07cf122663c4303350609A66A7B288C0";
        return "https://api.ethplorer.io/getAddressHistory/" + this.real_address + "?apiKey=freekey&token=" + antToken + "&type=transfer";
    }

    getTransactions(parsed) {
        var txs = [];
        parsed.operations.forEach(function(tx){
            txs.push(tx.transactionHash);
        });
        return txs;
    }


};

module.exports = AragonParser;