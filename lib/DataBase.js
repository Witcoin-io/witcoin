var SQL = require("node-sql-db");

class DataBase{
    constructor(options){
        var bdConfig={
            platform: "MySQL",
            host: "127.0.0.1",
            user: "witcoin",
            password: "gJafOWhdauYY89w9bl6V",
            database: "witcoin_ico",
            schema: [{
                name: "test",
                sql: ["create table if not exists transfer_intentions (id integer primary key AUTO_INCREMENT, origin_address text NOT NULL, coin text NOT NULL, ether_address text NOT NULL ,created timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP )",
                      "create table if not exists transactions(id integer primary key AUTO_INCREMENT, hash text NOT NULL, coin text NOT NULL, amount bigint unsigned, origin_address text ,status integer not null default 0,transfer_intention integer,created timestamp )"]
            }]
        };

        this.db=new SQL.Db(bdConfig);
    }

    insertTransaction(hash,coin,timestamp,callback){
        //check existing transaction
        var self=this;
        this.db.query("select count (*) as count from transactions where hash= ? and coin = ?",hash,coin, function (err, rows) {
            //no existing transaction
            if(rows !== undefined && parseInt(rows[0].count) === 0){
                self.db.execute("insert transactions (hash,coin) values (?,?)",
                                hash, coin, timestamp,callback);
            }
        });
    }

    validateTransaction(hash,coin,amount,adresses,timestamp,callback){

        var self=this;
        this.db.execute("select * from transfer_intentions where coin = ? and origin_address in (?) and created < ? order by created desc",coin,adresses,timestamp,function (err, rows) {
           if(rows.length==0){ //no transaction intent or invalid
               status = -1;
               transferintent = null
           }else{ //valid transaction intent
               transferintent = rows[0].id;
               status = 1;
           }
            self.db.execute("update transactions set amount = ? , origin_address = ?, transfer_intent = ? ,status = ?, where hash= ? and coin = ?",amount,adresses+'',transferintent,status,hash,coin,callback);
        });
    }

    setPayTransaction(hash,coin,callback){
        this.db.query("update transactions set status = 3, where hash= ? and coin = ?",hash,coin, callback);
    }
    setPayingTransaction(hash,coin,callback){
        this.db.query("update transactions set status = 2, where hash= ? and coin = ?",hash,coin, callback);
    }

    insertTransactionIntention(origin_address,coin,ether_address,created,callback) {
        this.db.execute("insert transfer_intentions (origin_address,coin,ether_address,created) values (?,?,?,?)",origin_address,coin,ether_address,created,callback);
    }

    getlastTransactionIntention(callback){

        this.db.query("select id from transfer_intentions order by id desc", function (err, rows) {
            if (err) { console.log(err);}

            if(rows.length){

                callback(rows[0].id);
            }else{
                callback(0);

            }

        });
    }

    close(){
        this.db.close();
    }
}

module.exports = DataBase;