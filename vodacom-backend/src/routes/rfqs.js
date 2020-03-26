const router = require("express").Router();
const handler = require("../services/request-injector");
const { isAuthenticated, isAccountType } = require("../middleware");
const rfqs = require("../controllers/rfqs");
const upload = require("multer")();

router.get(
  "/rfqs/explore",
  isAuthenticated,
  isAccountType("vendor"),
  handler(rfqs.explore)
);
router.post(
  "/rfqs",
  isAuthenticated,
  isAccountType("business"),
  upload.single("document"),
  handler(rfqs.create)
);
router.get("/rfqs", isAuthenticated, handler(rfqs.retrieveAll));
router.get(
  "/rfqs/:id",
  isAuthenticated,
  isAccountType("business"),
  handler(rfqs.retrieve)
);
router.delete(
  "/rfqs",
  isAuthenticated,
  isAccountType("business"),
  handler(rfqs.destroy)
);

module.exports = router;
