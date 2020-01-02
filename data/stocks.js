const dbConnection = require("../config/getCollection");

const getAll = async function getAll() {

    let stocksCollection = await dbConnection.getStocksCollection();
    result = await stocksCollection.find({}).toArray();
    return result;
}
const getStockByID = async function getStockByID(id) {
    if (!id || typeof(id) != 'string') throw "ID is invalid";

    id = require("mongodb").ObjectID(id);
    const stocksCollection = await dbConnection.getStocksCollection();
    const stockInfo = await stocksCollection.findOne({ _id: id });
    return stockInfo;
}
const getStockbyName = async function getStockbyName(name) {
    let stocksCollection = await dbConnection.getStocksCollection();
    if (name != "" || typeof name != undefined) {
        return await stocksCollection.findOne({ stockName: name });
    } else {
        throw "Invalid Stock Name, cant find details for given Stock Name";
    }
}
const buyStocks = async function buyStocks(req, stockName, purchaseQuantity) {

    let stocksCollection = await dbConnection.getStocksCollection();
    let userCollection = await dbConnection.getUserCollection();
    let users = await userCollection.find({}).toArray();
    let userid = require("mongodb").ObjectID(req.session.userInfo._id)
    let user = await userCollection.findOne({ _id: userid });
    result = await stocksCollection.findOne({ stockName: stockName });

    //ADD THE BALANCE CONDITION
    /* - If enough balance to purchase and enough available quantity
    // 1. decrease the number of quantity from all stocks table
    // 2. if user already have the stock INCREASE the quantity, or add the new id if not previously brought
    */
    let flag1 = false,
        flag2 = false;

    if (result.quantity - purchaseQuantity >= 0 && user.balance - (purchaseQuantity * result.Value) >= 0) {

        // Part 1 update

        const updateInfo1 = await stocksCollection.updateOne({ stockName: stockName }, { $set: { quantity: result.quantity - purchaseQuantity } });
        if (updateInfo1.modifiedCount === 0) {
            throw "could not decrease the stock quantity in stock table";
        } else { flag1 = true; }

        //Part 2 Update


        let isBrought = false;
        let stock = await getStockbyName(stockName);
        let buyList = user.buy;
        user.balance = parseInt(user.balance - (purchaseQuantity * result.Value));
        for (let i = 0; i < user.buy.length; i++) {
            if (user.buy[i].id == stock._id) {
                temp = user.buy[i];
                temp.buyQuant = parseInt(temp.buyQuant) + parseInt(purchaseQuantity);
                // console.log(temp);
                buyList[i] = temp;

                const updateInfo2 = await userCollection.updateOne({ email: req.session.userInfo.email }, { $set: { buy: buyList, balance: user.balance } });
                if (updateInfo2.modifiedCount === 0) {
                    throw "could not increase the stock quantity in User buy table";
                } else {
                    isBrought = true;
                    flag2 = true;
                    break;
                }
            }
        }
        if (!isBrought) {
            buyList[user.buy.length] = { 'id': stock._id + "", buyQuant: parseInt(purchaseQuantity) }
            const updateInfo2 = await userCollection.updateOne({ email: req.session.userInfo.email }, { $set: { buy: buyList, balance: user.balance } });
            if (updateInfo2.modifiedCount === 0) {
                throw "could not increase the stock quantity in User buy table";
            } else {
                flag2 = true;
            }
        }
    }

    if (flag1 && flag2) {
        console.log("returning ", flag1 && flag2);
        //Update session
        req.session.userInfo = await userCollection.findOne({ id: userid });
        console.log("Session Updated");
        return true;
    } //both part successful 
    else {
        return false;
    }
}

const populateStocks = async function populateStocks(req) {
    if (req.session.userInfo.buy != undefined || req.session.userInfo.buy != null) {
        let purchasedList = req.session.userInfo.buy;
        let updatedList = [];

        console.log("ins", purchasedList);
        for (let i = 0; i < purchasedList.length; i++) {
            if (purchasedList[i].buyQuant > 0) {
                stock = await getStockByID(purchasedList[i].id);
                updatedList[i] = {};
                updatedList[i].stockName = stock.stockName;
                updatedList[i].buyQuant = purchasedList[i].buyQuant;
                updatedList[i].Value = stock.Value;
            }
        }
        console.log("returning", updatedList);
        return updatedList;
    } else
        return null;

}
const createStocks = async function(stockName, tickerSymbol, quantity, Value) {
    let stocksCollection = await dbConnection.getStocksCollection();
    let newStock = {
        stockName: stockName,
        tickerSymbol: tickerSymbol,
        quantity: quantity,
        Value: Value
    }
    const insertInfo = await stocksCollection.insertOne(newStock);
    return insertInfo.insertedId.toString();
}
module.exports = { getAll, buyStocks, getStockbyName, getStockByID, populateStocks, createStocks }