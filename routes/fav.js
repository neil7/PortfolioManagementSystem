const express = require("express");
const router = express.Router();
const userdata = require("../data/user");
var jsdom = require('jsdom');
const connection = require("../config/getCollection");
const { JSDOM } = jsdom;
const { window } = new JSDOM();
const { document } = (new JSDOM('')).window;
global.document = document;

var $ = jQuery = require('jquery')(window);
var flag = false;
router.post("/", async(req, res) => {
    if (req.session.userInfo) {

        //1. find stock id from stock name
        //2. add stock id to user favorite if pressed once using flag...

        let stockid = req.session.userInfo.searchStock._id;
        let userCollection = await connection.getUserCollection();

        console.log("stock id is", stockid);
        user = await userdata.getUser(req.session.userInfo.email);
        console.log("after", user);
        for (let i = 0; user.favorites.length; i++) {
            if (user.favorites[i] === stockid) {

                user.favorites.splice(i, 1);
                let update = user.favorites;
                console.log("update k bad deleted ", update);
                const updatedInfo = await userCollection.updateOne({ email: user.email }, { $set: { favorites: update } });
                if (updatedInfo.modifiedCount == 0) {
                    console.log("____________________fails------------");
                } else {
                    console.log("____________________PASS------------");
                    flag = true;
                    break;
                }
            }
        }

        console.log("flag h ", flag);
        if (!flag) {
            console.log("flag insert");
            user.favorites.push(stockid);
            let updated = user.favorites;
            console.log("update k bad added ", updated);
            const updatedInfo = await userCollection.updateOne({ email: user.email }, { $set: { favorites: updated } });
            if (updatedInfo.modifiedCount == 0) {
                console.log("____________________fails------------");
            } else {
                flag = false;
                console.log("____________________PASS------------");
            }
        }

        req.session.userInfo = await userdata.getUser(req.session.userInfo._id);
    } else {
        res.render('posts/login', { msg: "Try Again" });
    }
});

module.exports = router;