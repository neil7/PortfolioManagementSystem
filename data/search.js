const dbConnection = require("../config/getCollection");
const ObjectId = require('mongodb').ObjectID;
module.exports = {
    // async getVoteCount(id) {
    //     //console.log('the id in votecount func is ', typeof(id));
    //     if (id != "" || id != undefined) {
    //         //console.log("stock id", id);

    //         let votesCollection = await dbConnection.getVotesCollection();
    //         ///console.log("votevol", votesCollection);

    //         result = await votesCollection.findOne({ "voteCount.stockId": ObjectId(id).str });
    //         // console.log("matched", result);
    //         return result;
    //     } else {
    //         throw "Invalid Stock Name, can't find details for given Stock Name";
    //     }
    // },
    async getVoteCount(id) {
        //console.log('the id in votecount func is ', typeof(id));
        if (id != "" || id != undefined) {
            let votesCollection = await dbConnection.getVotesCollection();
            let temp = await votesCollection.find({}).toArray();
            console.log("lengthhhhhhhhhhhh", temp);
            for (let i = 0; i < temp.length; i++) {
                if (temp[i].voteCount.StockId == id) {
                    console.log("MACHTED");
                    return temp[i];
                }
            }
            console.log("out of for");
            //return result;
        } else {
            throw "Invalid Stock Name, can't find details for given Stock Name";
        }
    },
    async getStockByName(name) {
        let searchCollection = await dbConnection.getStocksCollection();
        if (name != "" || name != undefined) {
            result_name = await searchCollection.findOne({ "stockName": { $regex: new RegExp("^" + name.toLowerCase(), "i") } });
            result_ticker = await searchCollection.findOne({ "tickerSymbol": { $regex: new RegExp("^" + name.toLowerCase(), "i") } });

            if (result_name) {
                var Id = result_name._id; // to fetch the id of stock found
                console.log("the stock id is:", Id);
                this.getVoteCount(Id);
                return result_name;
            }
            if (result_ticker) {
                Id = result_ticker._id;
                this.getVoteCount(Id);
                console.log("the stock id is:", Id);
                return result_ticker;
            }
        } else {
            throw "Invalid Stock Name, can't find details for given Stock Name";
        }
    }
}