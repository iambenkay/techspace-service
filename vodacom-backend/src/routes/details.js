const router = require("express").Router()
const handler = require("../services/request-injector")
const details = require("../controllers/details")
const { isAuthenticated } = require("../middleware")

router.get("/details/business/:id", isAuthenticated, handler(details.business))
router.get("/details/vendor/:id", isAuthenticated, handler(details.vendor))

module.exports = router
