let request = require('request');
let DataBase = require('./lib/DataBase');

var getTransactionsIntentions = function(){



    database=new DataBase({});

    database.getlastTransactionIntention(function(id){
console.log(id);
        request('https://witcoin.io/intentions.php?id='+id, function (error, response, body, callback) {
          if (!error && response.statusCode === 200) {
                var parsed = JSON.parse(body);

                for(var i in parsed){
                   var transaction= parsed[i];
                    database.insertTransactionIntention(transaction.origin_address,transaction.coin,transaction.ether_address,transaction.created,function(err,rows){});
                }
              database.close();
            } else {
                console.log("ERROR");
            }
        });
    });
};

getTransactionsIntentions();