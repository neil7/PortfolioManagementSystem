const express = require('express');
const router = express.Router();
const userData = require('../data/user');
const stocksData = require('../data/stocks');

router.get('/', async(req, res) => {
    if (req.session.userInfo) {
        res.render('posts/stocks', { stocks: await stocksData.getAll() });
    } else {
        res.render('posts/signup', { title: "SignUp Page", msg: "Signup first" });
    }
});

router.post('/', async(req, res) => {

    try {
        let formInfo = req.body;
        if (!formInfo) {
            res.status(400).render('posts/signup', { title: "Signup Page", error: 'You must provide data to create new user' });
        }
        if (!formInfo.firstname) {
            res.status(400).render('posts/signup', { title: "Signup Page", error: 'You must provide a firstname' });
        }
        if (!formInfo.lastname) {
            res.status(400).render('posts/signup', { title: "Signup Page", error: 'You must provide a lastname' });
        }
        if (!formInfo.email) {
            res.status(400).render('posts/signup', { title: "Signup Page", error: 'You must provide an emailId' });
        }
        if (!formInfo.password) {
            res.status(400).render('posts/signup', { title: "Signup Page", error: 'You must provide valid password' });
        }
        if (!formInfo.confirmpassword) {
            res.status(400).render('posts/signup', { title: "Signup Page", error: 'You must provide valid password' });
        }
        if (formInfo.password != formInfo.confirmpassword) {
            res.render('posts/signup', { title: "Signup Page", error: 'Password does not match' });
        } else {
            const newUser = await userData.createNewUser(formInfo.firstname, formInfo.lastname, formInfo.email, formInfo.password);
            if (newUser == false)
                res.render('posts/index', { title: "Ticker Talk", msg: "Sign Up Failed" });
            else
                res.render('posts/login', { title: "Ticker Talk", msg: "Sign Up success" });
        }

    } catch (e) {
        console.log('userFound');
        res.status(500);
    }
});

module.exports = router;