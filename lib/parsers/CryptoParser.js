/**
 * Created by Adrià on 03/10/2017.
 */

class CryptoParser {

    constructor() {
        this.confirmations_needed = 25;
        this.real_address = "";
        this.rate = 0;
        this.decimals = 8;
    }

    validTransaction(parsed){
        return this.getConfirmations(parsed) && this.getConfirmations(parsed) >= this.confirmations_needed;
    }

    emptyBody(body){
        return body === "Not found" || body === "{}";
    }

    getOriginAddresses(parsed){
        return ["to-do"];
    }

    getTransactionValue(parsed){};

    getTimestamp(parsed){
        return parsed.timestamp;
    };

    getConfirmations(parsed) {
        return parsed.confirmations;
    }

    getTxApiUrl(tx){};

    getTransactions(parsed){};

    toIntegerValue(value){
        return Math.round(value * Math.pow(10, 8));
    };

    toDecimalValue(value){
        return value / Math.pow(10, 8);
    };

    convertToWitCoins(value){
        return value * this.rate;
    };

    /**
     * API URls
     */

    getTxApiUrl(tx){};

    getAdrApiUrl(adr){};
}

module.exports = CryptoParser;