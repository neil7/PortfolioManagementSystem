const MongoClient = require("mongodb").MongoClient;
const mongoConfig = {
    "serverUrl": "mongodb://127.0.0.1:27017/",
    "database": "cs546"
};

let _connection = undefined;
let _db = undefined;

module.exports = async() => {
    if (!_connection) {
        _connection = await MongoClient.connect(mongoConfig.serverUrl);
        _db = await _connection.db(mongoConfig.database);
    }
    return _db;
};