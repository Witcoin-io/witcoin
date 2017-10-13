var request = require('request');


module.exports = function(callback) {

    class Database{
        constructor(options){
            var SQL = require("node-sql-db");
            this.db=new SQL.Db(options);
        }

        insertTransaction(hash,coin){
            //check existing transaction
            this.db.query("select count (*) as count from transactions where hash= ? and coin = ?",hash,coin, function (err, rows) {
                //no existing transaction
                if(parseInt(rows[0].count)!=0){
                    this.db.execute("insert transactions (hash,coin) values (?,?)",
                                    hash, coin,function (err, rows) {
                            console.log(err);
                        });

                }
            }.call(this));
        }
        getTransaction(hash,coin){
            this.db.query("select * transactions where hash= ? and coin = ?",hash,coin, function (err, rows) {
                console.log(rows);
            });
        }

        getData(){
            this.db.query("select * from test1 where id=0", function (err, rows) {
                console.log(rows);
            });
        }
        close(){
            this.db.close();
        }
    }


     // BY TRANSACTION HASH

    0x1F573D6Fb3F13d689FF844B4cE37794d79a7FF1C


    var confirmTransaction = function(coin, tx) {
        // Coin specific values
        var url = "";
        var valueParam = "";
        var confirmationsNeeded = 100;
        if (coin === "BTC") {
            url = "https://blockexplorer.com/api/tx/";
            valueParam = "valueOut";
            confirmationsNeeded = 6;
        } else if (coin === "BCH") {
            url = "https://bitcoincash.blockexplorer.com/api/tx/";
            valueParam = "valueOut";
            confirmationsNeeded = 6;
        } else if (coin === "LTC") {
            url = "https://chainz.cryptoid.info/ltc/api.dws?q=txinfo&t=";
            valueParam = "total_output";
            confirmationsNeeded = 6;
        } else if (coin === "DASH") {
            url = "https://chainz.cryptoid.info/dash/api.dws?q=txinfo&t=";
            valueParam = "total_output";
            confirmationsNeeded = 6;
        } else if (coin === "DASH") {
            url = "https://chainz.cryptoid.info/dash/api.dws?q=txinfo&t=";
            valueParam = "total_output";
            confirmationsNeeded = 6;
        }

        // Make request
        request(url + tx, function (error, response, body) {
            if (body === "Not found" || body === "{}") {
                console.log("NOT FOUND");
            } else if (!error && response.statusCode === 200) {
                var parsed = JSON.parse(body);
                if (parsed.confirmations && parsed.confirmations >= confirmationsNeeded) {
                    var value = parsed[valueParam];
                    console.log("CONFIRMED - " + value);
                } else {
                    console.log("PENDING - Confirmations: " + parsed.confirmations);
                }
            } else {
                console.log('ERROR');
            }
        });
    };

    var confirmTokenTransaction = function(coin, tx) {
        var url = "";
        var confirmationsNeeded = 12;
        if (coin === "ANT") {

        }
    };

    var coin = "LTC";
    var tx = "67859ae0983d13d128becbeeffc76106d11fe5198daefc040eef5136bbb87422";

    //confirmTransaction(coin, tx);
    //initDB();

    var bdConfig={
        platform: "MySQL",
        host: "127.0.0.1",
        user: "witcoin",
        password: "gJafOWhdauYY89w9bl6V",
        database: "witcoin_ico",
        schema: [{
        name: "test",
        sql: ["create table if not exists transfer_intentions (id integer primary key AUTO_INCREMENT, origin_address text NOT NULL, coin integer NOT NULL, ether_address text NOT NULL ,created timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP )",
            "create table if not exists transactions(id integer primary key AUTO_INCREMENT, hash text NOT NULL, coin text NOT NULL, amount integer, origin_address text ,status integer not null default 0,created timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP )"]
    }]
    };
   // database.initialize(bdConfig);
   // database.getdata();
database=new Database(bdConfig);

 database.insertTransaction('asdfasfd','asdfasfd');
//database.insertTransactions();
    database.close();
};
