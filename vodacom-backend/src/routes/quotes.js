const router = require("express").Router();
const { isAccountType, isAuthenticated } = require("../middleware");
const handler = require("../services/request-injector");
const quotes = require("../controllers/quotes");
const businessQuotes = require("../controllers/business/quotes");

router.post(
  "/quotes",
  isAuthenticated,
  isAccountType("vendor", "business"),
  handler(quotes.create)
);
router.post(
  "/business/quotes",
  isAuthenticated,
  isAccountType("business"),
  handler(businessQuotes.accept)
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
  isAccountType("vendor", "business"),
  handler(quotes.get)
);
router.get(
  "/quotes/:id",
  isAuthenticated,
  isAccountType("vendor", "business"),
  handler(quotes.getOne)
);

module.exports = router;
