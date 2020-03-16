const router = require("express").Router()
const {isAccountType, isAuthenticated} = require("../middleware")
const handler = require("../services/request-injector")
const quotes = require("../controllers/quotes")

router.all("/quotes")
    .post(isAuthenticated, isAccountType("vendor"), handler(quotes.create))
