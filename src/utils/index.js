const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")
const cuid = require("cuid")
const Collection = require("../models/orm")


const JWT_SECRET_KEY = "extremelysecretkey"
Account = Collection("accounts")

function createToken (payload) {
    return jwt.sign(payload, JWT_SECRET_KEY)
}
function removeDuplicates (list) {
    const result = []
    for (let i of list){
        if(!result.includes(i)) result.push(i)
    }
    return result
}


function verifyToken (token) {
    try {
        return jwt.verify(token, JWT_SECRET_KEY)
    } catch {
        return null
    }
}

function HTTPError(message) {
    return {
        error: true,
        message,
    }
}

function Id(){
    return cuid()
}

function isAuthenticated (req, res, next) {
    if(!req.get("Authorization") || !req.get("Authorization").startsWith("Bearer "))
        return res.status(401).send(HTTPError("You have to provide a JWT Token"))
    const token = req.get("Authorization").split(" ")[1]
    req.payload = verifyToken(token)
    if(!req.payload) return res.status(401).send(HTTPError("Invalid JWT Token"))
    return next()
}

function isAccountType(type) {
    return async (req, res, next) => {
        const {id} = payload
        const isType = await Account.find({_id: id}).then(user => user.userType === type)
        if (!isType) return res.status(401).send(HTTPError(`You need to have account type ${type} to access this route`))
    }
}

module.exports = {
    createToken,
    verifyToken,
    Id,
    HTTPError,
    isAuthenticated,
    removeDuplicates
}