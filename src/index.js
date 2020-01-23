const express = require("express")
const bodyParser = require("body-parser")
const cors = require("cors")

require("dotenv").config()

const {PORT = 3000} = process.env

const app = express()

app.use(cors())
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: true}))

app.use("/api/v1", require("./routes"))

app.listen(PORT, () => {
    console.log(`HTTP server started on port ${PORT}`)
})