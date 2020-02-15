const {verifyToken, HTTPError} = require("../utils")
const Collection = require("../data/orm")

const Account = Collection("accounts")

async function isAuthenticated (req, res, next) {
    if(!req.get("Authorization") || !req.get("Authorization").startsWith("Bearer "))
        return res.status(401).send(HTTPError("You have to provide a JWT Token"))
    const token = req.get("Authorization").split(" ")[1]
    req.payload = verifyToken(token)
    if(!req.payload) return res.status(401).send(HTTPError("Invalid JWT Token"))
    const user = await Account.find({_id: req.payload.id})
    if(!user) return res.status(401).send(HTTPError("Invalid Account details"))
    return next()
}

function isAccountType(type) {
    return async (req, res, next) => {
        const {userType} = req.payload
        if (userType !== type) return res.status(401).send(HTTPError(`You need to have account type ${type} to access this route`))
        return next()
    }
}

module.exports = Object.freeze({
    isAuthenticated,
    isAccountType
})