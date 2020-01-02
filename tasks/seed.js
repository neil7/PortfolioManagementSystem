const dbConnection = require('../config/mongoConnection');

const users = require('../data/user');
const stocks = require("../data/stocks");
const votes = require("../data/vote");
const mongodb = require("mongodb").ObjectID;

async function main() {
    try {
        const db = await dbConnection();
        await db.dropDatabase();
        //Stocks
        let amazon = await stocks.createStocks("Amazon", "amzn", 300, 2300);
        let google = await stocks.createStocks("Google", "googl", 50, 1300);
        let tesla = await stocks.createStocks("Tesla", "tsla", 100, 1000);
        let apple = await stocks.createStocks("Apple", "appl", 200, 500);
        let microsoft = await stocks.createStocks("Microsoft", "mcrs", 10, 200);
        let yahoo = await stocks.createStocks("Yahoo", "yh", 150, 100);

        //Votes
        await votes.createVote(amazon, 55, 31);
        await votes.createVote(google, 212, 60);
        await votes.createVote(apple, 43, 11);
        await votes.createVote(tesla, 12, 21);
        await votes.createVote(microsoft, 60, 22);
        await votes.createVote(yahoo, 90, 34);


        //add users
        let tony_id = await users.seedNewUser("tony", "jr.", "tony@gmail.com", "elementarymydearwatson", [amazon], [amazon], [{ "id": google, "buyQuant": 1 }], [{ "id": amazon, "sellQuant": 1 }, { "id": google, "sellQuant": 2 }, { "id": tesla, "sellQuant": "5" }], 12000);
        let cap_id = await users.seedNewUser("cap", "sol", "cap@gmail.com", "cap", [tesla], [microsoft], [{ "id": apple, "buyQuant": 1 }], [{ "id": google, "sellQuant": 1 }, { "id": yahoo, "sellQuant": "2" }, { "id": yahoo, "sellQuant": "5" }], 12000);
        let bob_id = await users.seedNewUser("bob", "wil", "bob@gmail.com", "bob", [microsoft], [tesla], [{ "id": yahoo, "buyQuant": 1 }], [{ "id": microsoft, "sellQuant": 1 }], 12000);
        let seam_id = await users.seedNewUser("seam", "tea", "seam@gmail.com", "seam", [yahoo], [amazon], [{ "id": google, "buyQuant": 1 }], [{ "id": microsoft, "sellQuant": 1 }], 12000);

        console.log('Done seeding database');

        await db.serverConfig.close();
    } catch (e) {
        console.log(e);
    }
}

main();