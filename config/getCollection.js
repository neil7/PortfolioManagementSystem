const dbConnection = require("./mongoConnection");

/* This will allow you to have one reference to each collection per app */
/* Feel free to copy and paste this this */
const getStocksCollection = async() => {

    const db = await dbConnection();
    _col = await db.collection("stocks");
    return _col;
};

const getUserCollection = async() => {

    const db = await dbConnection();
    _col = await db.collection("users");
    return _col;
};
const getVotesCollection = async() => {

    const db = await dbConnection();
    _col = await db.collection("Votes");
    return _col;
};
/* Now, you can list your collections here: */
module.exports = {
    getStocksCollection,
    getUserCollection,
    getVotesCollection
};