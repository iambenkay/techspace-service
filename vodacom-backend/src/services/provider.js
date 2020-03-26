const cuid = require("cuid")
const c = require("crypto")

module.exports.Id = () => cuid()

module.exports.RndToken = () => c.randomBytes(16).toString('hex')
