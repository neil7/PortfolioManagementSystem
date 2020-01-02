const stocksData = require("./stocks");
const userData = require("./user");
const searchData = require("./search");
const voteData = require("./vote");

// app.use("/", userData);
// app.use("/stocks", stocksData);
// app.use("/search", searchData);
// app.use("/vote", voteData);

module.exports = {
    stocksData,
    userData,
    searchData,
    voteData
};