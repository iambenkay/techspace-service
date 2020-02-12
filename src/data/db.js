const { MongoClient } = require("mongodb")
require("dotenv").config()
const {MONGODB_URI, DB_NAME} = process.env

const client = new MongoClient(MONGODB_URI, DB_NAME, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})


module.exports = async () => {
    if(!client.isConnected()) await client.connect()
    console.log(MONGODB_URI, DB_NAME)
    return client.db(DB_NAME)
}