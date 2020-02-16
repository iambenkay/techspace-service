const express = require("express")
const bodyParser = require("body-parser")
const cors = require("cors")
const V = require("./utils/validator")

const app = express()

app.use(cors())
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: false}))
app.use((req, _, next) => {
    req.V = V
    next()
})

app.use("/api/v1", require("./routes"))

module.exports = app