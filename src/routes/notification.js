const router = require("express").Router()
const { handler } = require("../utils")
const readNotification = require("../controllers/notification")

router.post("/login", handler(readNotification))

module.exports = router