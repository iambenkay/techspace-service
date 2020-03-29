const router = require("express").Router();
const { isAccountType, isAuthenticated } = require("../middleware");
const handler = require("../services/request-injector");
const quotes = require("../controllers/quotes");
const businessQuotes = require("../controllers/business/quotes");

router.post(
  "/quotes",
  isAuthenticated,
  isAccountType("vendor"),
  handler(quotes.create)
);
router.post(
  "/business/quotes",
  isAuthenticated,
  isAccountType("business"),
  handler(businessQuotes.create)
);
router.get(
  "/business/quotes/:quote_id",
  isAuthenticated,
  isAccountType("business"),
  handler(businessQuotes.getOne)
);
router.get(
  "/business/quotes",
  isAuthenticated,
  isAccountType("business"),
  handler(businessQuotes.get)
);
router.get(
  "/quotes",
  isAuthenticated,
  isAccountType("vendor"),
  handler(quotes.get)
);
router.get(
  "/quotes/:id",
  isAuthenticated,
  isAccountType("vendor"),
  handler(quotes.getOne)
);

module.exports = router;
