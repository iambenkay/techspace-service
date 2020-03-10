const c = require("crypto")
require("dotenv").config()
const { EMAIL_VER_TOKEN } = process.env

module.exports = data => c.createHmac('sha256', EMAIL_VER_TOKEN).update(data).digest('hex')