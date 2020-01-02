const express = require('express');
const router = express.Router();
const userData = require('../data/user');

router.get('/', async(req, res) => {
    if (req.session.userInfo) {
        res.render('posts/stocks', { title: "Ticker Talk", stocks: req.session.favList, userInfo: req.session.userInfo });
    } else {
        res.render('posts/index', { title: "Ticker Talk" });
    }
});
module.exports = router;