const express = require('express');
const router = express.Router();
const userData = require('../data/user');
const stockData = require('../data/stocks');

router.get('/', async(req, res) => {
    if (req.session.userInfo) {
        res.render('posts/stocks', { user: req.session.userInfo, stocks: req.session.favList });
    } else {
        res.render('posts/login', { title: "LogIn Page", msg: "Login first" });
    }
});

router.post('/', async(req, res) => {

    var password = req.body.password;
    var name = req.body.username;
    name = name.toLowerCase();
    if (await userData.compareCredentials(password, name)) {
        let userInfo = await userData.getUser(name);
        req.session.userInfo = userInfo;
        let stockID = userInfo.favorites;
        let favList = [];
        for (let i = 0; i < stockID.length; ++i) {
            favList[i] = await stockData.getStockByID(stockID[i]);
        }
        req.session.favList = favList;
        res.render('posts/stocks', { title: "Ticker Talk", stocks: favList, userInfo: userInfo }); //IDHATYFDBUAGUg
    } else {
        res.status(401).render("posts/login", { msg: "Invalid username/password" });
    }
});
module.exports = router;