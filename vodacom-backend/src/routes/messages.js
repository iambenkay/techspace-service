const router = require("express").Router()
const handler = require("../services/request-injector")
const messages = require("../controllers/messages")
const { isAccountType, isAuthenticated } = require("../middleware")

router.post("/messages", isAuthenticated, handler(messages.create))
router.post("/messages/heads", isAuthenticated, handler(messages.createHead))
router.get("/messages", isAuthenticated, handler(messages.fetch))
router.get("/messages/heads", isAuthenticated, handler(messages.fetchHead))

module.exports = router
