const c = require("crypto")
require("dotenv").config()
const { EMAIL_VER_SECRET } = process.env

module.exports = data => c.createHmac('sha256', EMAIL_VER_SECRET).update(data).digest('hex')
