const express = require('express');
const router = express.Router();
const userData = require('../data/user');
const stockData = require('../data/stocks');
const collection = require("../config/getCollection");

const middleware = async(req, res, next) => {
    try {
        if (!req.session.userInfo) {
            res.render('posts/index', { title: "Ticker Talk" });
        } else {
            userInfo = req.session.userInfo;
            const userCollection = await collection.getUserCollection();

            userid = require("mongodb").ObjectID(userInfo._id);
            // console.log("user id")
            // console.log(userid)
            user = await userCollection.findOne({ _id: userid });
            req.session.userInfo.buy = user.buy;
            req.session.userInfo.sell = user.sell;
            next();
        }
    } catch (e) {
        console.log(e)
    }

}


router.get('/', middleware, async(req, res) => {
    try {
        if (req.session.userInfo) {
            let buyStock = req.session.userInfo.buy;
            console.log("sdhjb")
            console.log(buyStock);
            console.log("jhdwje")
            buyList = []
            for (let i = 0; i < buyStock.length; ++i) {
                let stockID = buyStock[i].id;
                let buyQty = buyStock[i].buyQuant;
                buyList[i] = await stockData.getStockByID(stockID);
                buyList[i].quantity = buyQty;
            }

            req.session.buyList = buyList;

            let sellStock = req.session.userInfo.sell;
            console.log("in for loop121")
            console.log(sellStock);
            sellList = []

            for (let i = 0; i < sellStock.length; ++i) {
                console.log("in for loop121")
                let stockID = sellStock[i].id;
                let buyQty = sellStock[i].sellQuant;
                console.log("in for loop")
                console.log(String(stockID))
                sellList[i] = await stockData.getStockByID(String(stockID));
                sellList[i].quantity = buyQty;
            }

            req.session.sellList = sellList;
            res.render('posts/orderHistory', { title: "Ticker Talk", boughtStocks: buyList, soldStocks: sellList }); //IDHATYFDBUAGUg
        } else {
            res.render('posts/index', { title: "Ticker Talk" });
        }
    } catch (e) {
        console.log(e)
        res.status(404).json({ message: e });
    }
});
module.exports = router;