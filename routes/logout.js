const express = require("express");
const router = express.Router();

router.get("/", (req, res) => {
    try {
        req.session.userInfo = null;
        req.session.destroy(function(err) {
            console.log("Session destroyed");
        })
        res.render("posts/logout");
    } catch (e) {
        res.render("posts/logout", { msg: "Log out failed" });
    }
});

module.exports = router;