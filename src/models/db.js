const { MongoClient } = require("mongodb")
require("dotenv").config()
const {MONGO_URI, DB_NAME} = process.env

const client = new MongoClient(MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})

console.log(MONGO_URI, DB_NAME)

module.exports = async () => {
    if(!client.isConnected()) await client.connect()
    return client.db(DB_NAME)
}