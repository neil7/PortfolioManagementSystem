const dbConnection = require("../config/getCollection");
const ObjectId = require('mongodb').ObjectID;

module.exports = {
    async createVote(StockId, upVote, downVote) {
        let voteCollection = await dbConnection.getVotesCollection();
        let newVote = {
            voteCount: {
                StockId: StockId,
                upVote: upVote,
                downVote: downVote
            }
        }
        const insertInfo = await voteCollection.insertOne(newVote);
        return insertInfo.insertedId.toString();
    },
    async updateUserVote(id, stockId, voteArr) {
        if (!id || typeof(id) != 'string') throw "ID is invalid";
        let usersCollection = await dbConnection.getUserCollection();
        voteArr.push(stockId);
        console.log("vote array, hurray", voteArr);
        var id = require("mongodb").ObjectID(id);
        // console.log("mongo id", id);
        const updateInfo = await usersCollection.updateOne({ _id: id }, { $set: { votes: voteArr } });
        if (updateInfo.modifiedCount === 0) {
            throw "could not update votes successfully";
        }
    },
    async changeUpVoteCount(stockInfo) {

        let votesCollection = await dbConnection.getVotesCollection();
        var up = stockInfo.voteCount.upVote;
        var id = stockInfo._id;
        id = require("mongodb").ObjectID(id);
        console.log("id", id);
        console.log("before", up);
        up = parseInt(up) + 1;
        console.log("after", up);
        const updatedStockInfo = {
            StockId: stockInfo.voteCount.StockId,
            upVote: up,
            downVote: stockInfo.voteCount.downVote
        };
        console.log("updated", updatedStockInfo);
        const updateInfo = await votesCollection.updateOne({ _id: id }, { $set: { voteCount: updatedStockInfo } });
        if (updateInfo.modifiedCount === 0) {
            throw "could not update votes successfully";
        }
    },

    async changeDownVoteCount(stockInfo) {
        let votesCollection = await dbConnection.getVotesCollection();
        var down = stockInfo.voteCount.downVote;
        var id = stockInfo._id;
        id = require("mongodb").ObjectID(id);
        console.log("id", id);
        console.log("before", down);
        down = parseInt(down) + 1;
        console.log("after", down);
        const updatedStockInfo = {
            StockId: stockInfo.voteCount.StockId,
            upVote: stockInfo.voteCount.upVote,
            downVote: down
        };
        console.log("updated", updatedStockInfo);
        const updateInfo = await votesCollection.updateOne({ _id: id }, { $set: { voteCount: updatedStockInfo } });
        if (updateInfo.modifiedCount === 0) {
            throw "could not update votes successfully";
        }
    }
}