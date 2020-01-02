const express = require("express");
const router = express.Router();
const searchdata = require("../data/search");

router.get("/", async(req, res) => {
    res.render("posts/unauth_search", { title: "Search", msg: "Empty stock name" });
});
router.post("/", async(req, res) => {
    try {
        //console.log(req.body.search_bar);
        if (req.body.search_bar === undefined || req.body.search_bar == "" || req.body.search_bar == null) {
            res.render("posts/index", { msg: "Empty stock name" });
        } else {
            if (req.session.userInfo) {
                //show stocks with buy, add to watchlist, current price, vote button and chart
                let searchCollection = await searchdata.getStockByName(req.body.search_bar);
                if (searchCollection != null || searchCollection != undefined) {
                    let voteCollection = await searchdata.getVoteCount(searchCollection._id);
                    req.session.userInfo.searchStock = searchCollection;
                    req.session.voteList = voteCollection;
                    res.render("posts/auth_search", { title: "Stocks Details", search: searchCollection, vote: voteCollection });
                } else {
                    res.status(200).render("posts/stocks", { msg: "Invalid Search Name, try Searching with other query" });
                }
            } else {

                let searchCollection1 = await searchdata.getStockByName(req.body.search_bar);
                if (searchCollection1 != null || searchCollection1 != undefined) {
                    let voteCollection1 = await searchdata.getVoteCount(searchCollection1._id);
                    res.render("posts/unauth_search", { title: "Stocks Details", search: searchCollection1, vote: voteCollection1 });
                } else {
                    res.status(200).render("posts/index", { msg: "Invalid Search Name" });
                }
            }
        }
    } catch (e) {
        res.status(404).render("posts/unauth_search", { msg: "Error ..Retry" });
    }
});

module.exports = router;