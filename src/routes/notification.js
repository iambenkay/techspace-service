const router = require("express").Router()
const { handler } = require("../utils")
const { isAuthenticated } = require("../middleware")
const readNotification = require("../controllers/notification")

router.post("/notifications", isAuthenticated, handler(readNotification))
router.get("/notifications", isAuthenticated, handler(getNotifications))

module.exports = router