const hash = require("../services/hash-injector")
require("dotenv").config()
const { CLIENT_APP } = process.env
const express = require("express")
const Account = require("../data/orm")("accounts")

/**
 * @param {express.request} request
 * @param {express.response} response
 */
module.exports = (request, response) => {
    const { token, email } = request.query
    if (hash(email) === token) {
        Account.update({ email }, { isVerified: true })
        return response.redirect(`${CLIENT_APP}/login`)
    }
    response.redirect(CLIENT_APP)
}
