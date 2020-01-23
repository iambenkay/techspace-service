const router = require("express").Router()

router.use(require("./login"))
router.use(require("./accounts"))

module.exports = router