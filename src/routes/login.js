const router = require("express").Router()
const Collection = require("../data/orm")
const { handler } = require("../utils")
const login = require("../controllers/auth/login")

const Account = Collection("accounts")

router.post("/login", handler(login))

module.exports = router