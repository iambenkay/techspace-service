const router = require("express").Router()
const handler = require("../services/request-injector")
const { isAuthenticated, isAccountType } = require("../middleware")
const dashboard_data = require("../controllers/ui/dashboard-data")

router.get("/ui/vendor-dashboard-data", isAuthenticated, isAccountType("vendor"), handler(dashboard_data.vendor))
router.get("/ui/business-dashboard-data", isAuthenticated, isAccountType("business"), handler(dashboard_data.business))
router.get("/ui/regular-dashboard-data", isAuthenticated, isAccountType("regular"), handler(dashboard_data.regular))

module.exports = router
