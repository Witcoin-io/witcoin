let CryptoParser = require('./CryptoParser.js');

/**
 * Created by Adrià on 03/10/2017.
 */
class MoneroParser extends CryptoParser {

    getTransactionValue(parsed){
        return 0;
    }

    getConfirmations(parsed) {
        return 0;
    }

    validReceiver(parsed){
        return false;
    }

    getTxApiUrl(tx){
        return "";
    }

    getTransactions(parsed) {
        return [];
    }

    getAdrApiUrl(adr){
        return "";
    }

}

module.exports = MoneroParser;
