module.exports = function (app) {
    app.use("/user", require("./user"));
    app.use("/item", require("./question"));
    app.use("/question", require("./question"));
    app.use("/", (req, res) => {
        res.json({"message": "Welcome to the API"})
    });
};
