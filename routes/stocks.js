const express = require("express");
const router = express.Router();
const stocksdata = require("../data/stocks");


const middleware = async(req, res, next) => {
    try {
        if (req.session.userInfo) {
            let stockCollection = req.session.userInfo.favorites;
            let list = [];
            for (let i = 0; i < stockCollection.length; i++) {
                list[i] = await stocksdata.getStockByID(stockCollection[i])
            }
            console.log("isn", list);
            res.render("posts/stocks", { title: "Ticker Talk", stocks: list });
        } else {
            res.render("posts/index", { title: "Ticker Talk", msg: "Sign in again" });
            next();
        }
    } catch (e) {
        console.log(e)
    }

}

router.get("/", middleware, async(req, res) => {
    try {
        if (req.session.userInfo) {
            let stockCollection = req.session.userInfo.favorites;
            let list = [];
            for (let i = 0; i < stockCollection.length; i++) {
                list[i] = await stocksdata.getStockByID(stockCollection[i])
            }
            console.log("isn", list);
            res.render("posts/stocks", { title: "Ticker Talk", stocks: list });
        } else {
            res.render("posts/index", { title: "Ticker Talk", msg: "Sign in again" });
        }
    } catch (e) {
        res.status(404).render("posts/index", { title: "Ticker Talk", msg: "Please Sign in First" });
    }
});

module.exports = router;