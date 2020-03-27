const router = require("express").Router()

router.use(require("./login"))
router.use(require("./accounts"))
router.use(require("./notification"))
router.use(require("./rfqs"))
router.use(require("./ui"))
router.use(require("./details"))
router.use(require("./quotes"))
router.use(require("./messages"))

module.exports = router
