const router = require("express").Router()
const { handler } = require("../utils")
const { isAuthenticated, isAccountType } = require("../middleware")
const readNotification = require("../controllers/notification")

router.post("/notifications", isAuthenticated, handler(readNotification))

module.exports = router