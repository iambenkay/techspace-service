const router = require("express").Router();
const handler = require("../services/request-injector");
const archive = require("../controllers/archives");
const { isAuthenticated, isAccountType } = require("../middleware");
const upload = require("multer")();

router.post(
  "/archives",
  isAuthenticated,
  isAccountType("business", "vendor"),
  upload.single("document"),
  handler(archive.add)
);
router.delete(
  "/archives",
  isAuthenticated,
  isAccountType("business", "vendor"),
  handler(archive.remove)
);
router.get(
  "/archives",
  isAuthenticated,
  isAccountType("business", "vendor"),
  handler(archive.fetchAll)
);
router.get(
  "/archives/:arch_id",
  isAuthenticated,
  isAccountType("business", "vendor"),
  handler(archive.fetch)
);

module.exports = router;
