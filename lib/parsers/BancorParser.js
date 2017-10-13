let CryptoParser = require('./CryptoParser.js');

/**
 * Created by Adrià on 03/10/2017.
 */
class BancorParser extends  CryptoParser{

    constructor() {
        super();
        this.rate = 5;
        this.decimals = 18;
        this.confirmations_needed = 12;
        // this.real_address = "0x04CF6551a4e0810C32DedBd76228b715f2598A33";
        this.real_address = "0x00156cd84776616bcc0bc5f78867cc2b67f8a285"; // TEST
    }

    getTransactionValue(parsed){
        var value = 0;
        var receiver = this.real_address;
        var decimals = this.decimals;
        parsed.operations.forEach(function(operation){
            if (operation.to === receiver) {
                var val = operation.value * 1 / Math.pow(10, decimals);
                value += Math.round(val * Math.pow(10, 8)) / Math.pow(10, 8);
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
        var bntToken = "0x1F573D6Fb3F13d689FF844B4cE37794d79a7FF1C";
        return "https://api.ethplorer.io/getAddressHistory/" + this.real_address + "?apiKey=freekey&token=" + bntToken + "&type=transfer";
    }

    getTransactions(parsed) {
        var txs = [];
        parsed.operations.forEach(function(tx){
            txs.push(tx.transactionHash);
        });
        return txs;
    }

}

module.exports = BancorParser;