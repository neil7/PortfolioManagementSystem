// const axios = require('axios');
const bcrypt = require('bcrypt');
const dbConnection = require("../config/getCollection");
module.exports = {
    async getAllUsers() {

        let usersCollection = await dbConnection.getUserCollection();
        result = await usersCollection.find({}).toArray();
        return result;
    },
    async getUser(name) {
        let userCollection = await dbConnection.getUserCollection();
        userInfo = await userCollection.findOne({ email: name });
        return userInfo;
    },
    async createNewUser(firstname, lastname, email, password) {
        let userCollection = await dbConnection.getUserCollection();

        const userFound = await userCollection.find({ 'email': email.toLowerCase() }).toArray();
        if (userFound.length != 0) return false;
        else {
            var hashedPassword = await bcrypt.hash(password, 16);
            let newUser = {
                firstname: firstname,
                lastname: lastname,
                email: email.toLowerCase(),
                password: hashedPassword,
                favorites: [],
                votes: [],
                buy: [],
                sell: [],
                balance: 10000
            }
            const insertInfo = await userCollection.insertOne(newUser);
            return insertInfo.insertedId.toString();
        }
    },
    async seedNewUser(firstname, lastname, email, password, favorites, votes, buy, sell, balance) {
        let userCollection = await dbConnection.getUserCollection();

        const userFound = await userCollection.find({ 'email': email.toLowerCase() }).toArray();
        if (userFound.length != 0) return false;
        else {
            var hashedPassword = await bcrypt.hash(password, 16);
            let newUser = {
                firstname: firstname,
                lastname: lastname,
                email: email.toLowerCase(),
                password: hashedPassword,
                favorites: favorites,
                votes: votes,
                buy: buy,
                sell: sell,
                balance: balance
            }
            const insertInfo = await userCollection.insertOne(newUser);
            return insertInfo.insertedId.toString();
        }
    },
    async compareCredentials(password, name) {

        var users = await this.getAllUsers();

        try {
            for (let i = 0; i < users.length; ++i) {
                if (name === users[i].email) {
                    {
                        if (await bcrypt.compareSync(password, users[i].password))
                            return true;
                    }
                }
            }
        } catch (e) {
            console.log("BCRYPT ERROR" + e);
            return false;
        }
    }
}