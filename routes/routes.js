
var appRouter = function(app) {

    app.post("/", function(req, res) {
        res.send("Hello World");
    });

};

module.exports = appRouter;