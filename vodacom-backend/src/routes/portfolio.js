const router = require("express").Router();
const handler = require("../services/request-injector");
const portfolio = require("../controllers/accounts/portfolio");
const { isAuthenticated } = require("../middleware");

router.post("/portfolio", isAuthenticated, handler(portfolio.post));
router.get("/portfolio", isAuthenticated, handler(portfolio.get));
router.get("/portfolio/:id", handler(portfolio.findForUser));

module.exports = router;
