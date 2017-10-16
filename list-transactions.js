let DataBase = require('./lib/DataBase');

var database = new DataBase({});

database.getTransactions(function(rows){
    for(var i=0; i<rows.length; i++){
        var row = rows[i];
        console.log("New transaction in "+row.coin+"!");
        console.log("  Hash: " + row.hash);
    }
    if (rows.length === 0) {
        console.log("0 Transactions...")
    }
});

database.close();
