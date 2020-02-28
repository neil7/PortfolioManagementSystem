const homeRoutes = require('./home');
const stocksRoutes = require('./stocks');
const buyStocks = require('./buyStocks');
const loginRoutes = require("./login");
const logoutRoutes = require("./logout");
const sellStocks = require("./sellStocks");
const signupRoutes = require("./signup");
const orderHistory = require("./orderHistory");
const voteRoutes = require("./vote");
const searchRoutes = require("./search");
const favRoutes = require("./fav");

const constructorMethod = app => {
    app.use("/", homeRoutes);
    app.use("/stocks", stocksRoutes);
    app.use("/buy", buyStocks);
    app.use("/sell", sellStocks);
    app.use("/signup", signupRoutes);
    app.use("/login", loginRoutes);
    app.use("/logout", logoutRoutes);
    app.use("/history", orderHistory);
    app.use("/vote", voteRoutes);
    app.use("/fav", favRoutes);
    app.use("/search", searchRoutes);

    app.use("/error", (req, res) => {
        res.status(404).render("posts/error");
    });
    app.use("*", (req, res) => {
        res.status(404).render("posts/error");
    });
};

module.exports = constructorMethod;