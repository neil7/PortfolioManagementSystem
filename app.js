const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const exphbs = require("express-handlebars");
const static = express.static(__dirname + "/public");
const stockData = require("./data/stocks");
const configRoutes = require("./routes");

const cookieParser = require("cookie-parser");
const session = require("express-session");

app.set("view engine", "handlebars");
app.engine("handlebars", exphbs({ defaultLayout: "main" }));

app.use('/public', static);
app.use(bodyParser.json());

app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: false }));

app.use(session({
    name: 'AuthCookie',
    secret: 'some secret string!',
    resave: false,
    saveUninitialized: true,
    isLoggedIN: false,
    userInfo: {}
}))


configRoutes(app);

app.listen(3000, () => {
    console.log("We've now got a server!");
    console.log("Your routes will be running on http://localhost:3000");
});