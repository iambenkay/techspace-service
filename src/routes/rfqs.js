const router = require("express").Router()
const handler = require("../services/request-injector")
const { isAuthenticated, isAccountType } = require("../middleware")
const rfqs = require("../controllers/rfqs")

router.get("/rfqs/explore", isAuthenticated, isAccountType("vendor"), handler(rfqs.explore))
router.post("/rfqs", isAuthenticated, isAccountType("business"), handler(rfqs.create))
router.get("/rfqs", isAuthenticated, isAccountType("business"), handler(rfqs.retrieveAll))
router.get("/rfqs/:id", isAuthenticated, isAccountType("business"), handler(rfqs.retrieve))
router.delete("/rfqs", isAuthenticated, isAccountType("business"), handler(rfqs.destroy))


module.exports = router
