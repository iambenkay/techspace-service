const router = require("express").Router()
const { handler } = require("../utils")
const login = require("../controllers/auth/login")

router.post("/login", handler(login))

module.exports = router