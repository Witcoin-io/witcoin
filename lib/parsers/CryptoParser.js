/**
 * Created by Adrià on 03/10/2017.
 */

class CryptoParser {

    constructor() {
        this.confirmations_needed = 25;
        this.real_address = "";
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

    getConfirmations(parsed) {
        return parsed.confirmations;
    }

    getTxApiUrl(tx){};

    getTransactions(parsed){};

    /**
     * API URls
     */

    getTxApiUrl(tx){};

    getAdrApiUrl(adr){};
}

module.exports = CryptoParser;