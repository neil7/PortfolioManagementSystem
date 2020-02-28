const express = require("express");

const router = express.Router();

const userdata = require("../data/user");

const voteData = require("../data/vote");

/* const jsdom = require('jsdom');

$ = require('jquery')(jsdom.jsdom().parentWIndow); */

var jsdom = require('jsdom');

const { JSDOM } = jsdom;

const { window } = new JSDOM();

const { document } = (new JSDOM('')).window;

global.document = document;



var $ = jQuery = require('jquery')(window);



// router.get('/', async(req, res) => {

//     if (req.session.userInfo) {

//         res.render('posts/auth_search', { msg: "Voting Done!" });

//     } else {

//         res.render('posts/login', { msg: "Login first" });

//     }

// });



router.post("/", async(req, res) => {

    if (req.session.userInfo) {



        let userInfo = req.session.userInfo;

        let votesInfo = userInfo.votes;

        let stockInfo = req.session.voteList

        let userId = userInfo._id;

        console.log("User id", userId);

        console.log("stock info", stockInfo);

        let stockId = stockInfo.voteCount.StockId;

        console.log("My info - ", votesInfo);

        console.log("my stock ID", stockId);

        for (let i = 0; i < votesInfo.length; ++i) {

            if (stockId === votesInfo[i]) {

                throw "Cannot vote";

            }

        }

        await voteData.updateUserVote(userId, stockId, votesInfo);

        let voteId = stockInfo._id;

        console.log("voteId", voteId);

        console.log("ajax start - ");

        let buttonType = req.body.id;

        console.log("ajax really start");

        if (buttonType === 'upVote') {

            // for(let i=0; i<votesInfo.length; ++i){

            //     if(stockId == votesInfo[i]){

            //         res.render('posts/error', {msg: "You've already voted"});

            //     }

            // }

            console.log("for up button")

            await voteData.changeUpVoteCount(stockInfo);

        }

        if (buttonType === 'downVote') {

            console.log("for down button")

            await voteData.changeDownVoteCount(stockInfo);

        }



        // res.render('posts/auth_search', { msg: "Voting Done!" });





    } else {

        res.render('posts/login', { msg: "Login first" });

    }

});



module.exports = router;