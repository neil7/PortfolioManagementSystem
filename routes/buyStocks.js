const express = require("express");
const router = express.Router();
const stocksdata = require("../data/stocks");

router.get("/", async(req, res) => {
    if (req.session.userInfo != null) {
        let stockCollection = await stocksdata.getAll();
        res.render("posts/buyStocks", { title: "Ticker Talk", stocks: stockCollection });
    } else {
        res.render("posts/index", { title: "Ticker Talk", msg: "Tip: You must login first" });
    }
});

router.post("/", async function(req, res) {
    try {
        if (req.session.userInfo) {
            let stockCollection = await stocksdata.getAll();
            stockName = req.body.dropdownMenuButton;
            quantity = req.body.quantity;
            userInfo = req.session.userInfo;
            let flag = stocksdata.buyStocks(req, stockName, quantity);
            if (flag) {
                console.log("pass");
                res.render("posts/buyStocks", { title: "Ticker Talk", stocks: stockCollection, msg: "Purchase Success, you can see stocks in order details" }); //send a message to buy stock page that you have purchased
            } else {
                console.log("fail");
                res.render("posts/buyStocks", { title: "Ticker Talk", stocks: stockCollection, msg: "Purchase Unsuccessfull, Either you have low balance or Company dont have enough Stocks to sell" });
            }
        } else {
            res.render('posts/index', { title: "Ticker Talk" });
        }
    } catch (e) {
        res.status(404).render('posts/index', { title: "Ticker Talk" });
    }
});
module.exports = router;