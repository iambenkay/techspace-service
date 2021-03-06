const router = require("express").Router()
const handler = require("../services/request-injector")
const { isAuthenticated } = require("../middleware")
const notifications = require("../controllers/notification")

router.post("/notifications", isAuthenticated, handler(notifications.read))
router.get("/notifications", isAuthenticated, handler(notifications.retrieve))

module.exports = router