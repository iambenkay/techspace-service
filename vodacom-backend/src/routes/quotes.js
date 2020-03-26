const router = require("express").Router()
const { isAccountType, isAuthenticated } = require("../middleware")
const handler = require("../services/request-injector")
const quotes = require("../controllers/quotes")

router.post("/quotes", isAuthenticated, isAccountType("vendor"), handler(quotes.create))
router.get("/quotes", isAuthenticated, isAccountType("vendor"), handler(quotes.get))
router.get("/quotes/:id", isAuthenticated, isAccountType("vendor"), handler(quotes.getOne))

module.exports = router
