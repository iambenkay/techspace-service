const { MongoClient } = require("mongodb")
require("dotenv").config()
const {MONGODB_URI, DB_NAME} = process.env

const client = new MongoClient(MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})

console.log(MONGODB_URI, DB_NAME)

module.exports = async () => {
    if(!client.isConnected()) await client.connect()
    return client.db(DB_NAME)
}