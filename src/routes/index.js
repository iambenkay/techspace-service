const router = require("express").Router()

router.use(require("./login"))
router.use(require("./accounts"))
router.use(require("./notification"))
router.use(require("./rfqs"))
router.use(require("./ui"))

module.exports = router
