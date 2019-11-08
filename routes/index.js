module.exports = function (app) {
    app.use("/user", require("./user"));
    app.use("/question", require("./question"));
    app.use("/answer",require("./ans"));
    app.use("/tag",require('./tag'));
    app.use("/votes",require('./votes'));
    app.use("/", (req, res) => {
        res.json({"message": "Welcome to the API"})
    });
};
