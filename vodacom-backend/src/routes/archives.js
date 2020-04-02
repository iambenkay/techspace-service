const router = require("express").Router();
const handler = require("../services/request-injector");
const archive = require("../controllers/archives");
const upload = require("multer")();

router.post("/archives", upload.single("document"), handler(archive.add));
router.delete("/archives", handler(archive.remove));
router.get("/archives", handler(archive.fetchAll));
router.get("/archives/:arch_id", handler(archive.fetch));

module.exports = router;
