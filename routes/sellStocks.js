const express = require("express");
const router = express.Router();
const stocksdata = require("../data/stocks");
const collection = require("../config/getCollection");

router.get("/", async(req, res) => {
    if (req.session.userInfo) {
        try {
            //populate stocks purchased by user here.
            let purchased = await stocksdata.populateStocks(req);
            if (purchased != null && purchased.length > 0) {
                res.render("posts/sellStocks", { title: "Ticker Talk", stocks: purchased });
            } else {
                res.render("posts/sellStocks", { title: "Ticker Talk", msg: "Tip: You may not be able to sell those you no longer own", stocks: await stocksdata.getAll() })
            }
        } catch (e) {
            res.render("posts/buyStocks", { title: "Ticker Talk", msg: "Buy some Stocks first before selling", stocks: await stocksdata.getAll() })
        }
    } else {
        res.render('posts/index', { title: "Ticker Talk" });
    }

});
router.post("/", async function(req, res) {
    try {
        if (req.session.userInfo) {

            //1.i) Decrease quantity in user buy table and increase the balance by quantity sold
            // 1.ii) add detail in sell array
            //2. Increase quantity in total stocks table

            let stockCollection = await collection.getStocksCollection();
            const userCollection = await collection.getUserCollection();

            sellStockName = req.body.dropdownMenuButton;
            quantity = req.body.quantity;
            userInfo = req.session.userInfo;
            userid = require("mongodb").ObjectID(userInfo._id);
            user = await userCollection.findOne({ _id: userid });
            sellStock = await stocksdata.getStockbyName(sellStockName);
            buylist = user.buy;
            balance = user.balance;
            let flag1 = false,
                flag2 = false;
            // console.log("gotcha");
            // console.log(sellStockName, quantity, userInfo);
            // console.log("simple user");
            // console.log(user);

            // Part 1 update
            for (let i = 0; i < user.buy.length; i++) {

                if (user.buy[i].id == sellStock._id && user.buy[i].buyQuant - quantity >= 0) {
                    buylist[i].buyQuant = user.buy[i].buyQuant - quantity;
                    balance = balance + sellStock.Value * quantity;
                    console.log(buylist[i].buyQuant);

                    const updateInfo1 = await userCollection.updateOne({ email: user.email }, { $set: { buy: buylist, balance: balance } });

                    if (updateInfo1.modifiedCount === 0) {
                        populate = await stocksdata.populateStocks(req);
                        res.render("posts/sellStocks", { title: " Failed! Ticker Talk", msg: "Sell Failed, please try again later.", stocks: populate })
                    } else {
                        console.log("part 1 complete ");
                        flag1 = true;
                    }
                    if (flag1) {
                        let sellItem = {};
                        sellItem.id = sellStock._id;
                        sellItem.sellQuant = quantity;
                        console.log("user sell is", user.sell);
                        let sellList = user.sell;
                        sellList[sellList.length] = sellItem;
                        console.log("sell list ", sellList);
                        const updateInfo2 = await userCollection.updateOne({ email: user.email }, { $set: { sell: sellList } });
                        if (updateInfo2.insertedCount === 0) flag1 = false;
                        console.log("add sell success");

                        //Update session
                        req.session.userInfo = await userCollection.findOne({ _id: userid });
                        console.log("Session Updated");
                    }
                }
            }

            //Part 2 update
            if (flag1) {
                let totalQuantity = parseInt(sellStock.quantity) + parseInt(quantity);
                //console.log("total quant", totalQuantity, sellStockName);
                updateInfo1 = stockCollection.updateOne({ stockName: sellStockName }, { $set: { quantity: totalQuantity } });
                if (updateInfo1.modifiedCount === 0) {
                    populate = await stocksdata.populateStocks(req);
                    res.render("posts/sellStocks", { title: "Failed! Ticker Talk", msg: "Sell Failed, please try again later.", stocks: populate })
                } else {
                    flag2 = true;
                }
            }

            //Final check
            if (flag1 && flag2) {
                console.log("flags", flag1 && flag2);
                populate = await stocksdata.getAll();
                console.log("populate", populate);
                res.render("posts/buyStocks", { title: "Ticker Talk", msg: "Sell Success, your Updates are visible in your order History. Want to buy some more?", stocks: populate });
            } else {
                populate = await stocksdata.populateStocks(req);
                res.render("posts/sellStocks", { title: "Ticker Talk", msg: "Something went wrong please try again later.", stocks: populate })
            }
        } else {
            res.render('posts/index', { title: "Ticker Talk" });
        }
    } catch (e) {
        populate = await stocksdata.getAll();
        res.status(404).render("posts/sellStocks", { title: "Ticker Talk", msg: "Something went wrong please try again later.", stocks: populate })
    }
});
module.exports = router;