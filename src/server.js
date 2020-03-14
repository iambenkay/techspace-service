const express = require("express")
const bodyParser = require("body-parser")
const cors = require("cors")
const V = require("./services/validator")

const app = express()

app.use(cors())
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: false}))
app.use((req, _, next) => {
    req.V = V
    next()
})

app.use("/api/v1", require("./routes"))
app.get("/verify", require("./routes/verify"))
app.get("/vendor-invite", require("./routes/vendor-invite"))
app.get("/admin-invite", require("./routes/admin-invite"))

module.exports = app
