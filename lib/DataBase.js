module.exports = {

    initialize:function (options) {
        var SQL = require("node-sql-db");
        this.db=new SQL.Db(options);
       // this.db.execute("insert into test1 (id, test1) values (4, 'testing')");
    },

    getdata: function() {
        this.db.query("select * from test1 where id=0", function (err, rows) {
            console.log(rows);

        });
        this.db.close();
    }

};
