const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")
const cuid = require("cuid")

const JWT_SECRET_KEY = "extremelysecretkey"

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
        return res.status(401).send(httperror("You have to provide a JWT Token"))
    const token = req.get("Authorization").split(" ")[1]
    req.payload = verifyToken(token)
    if(!req.payload) return res.status(401).send(httperror("Invalid JWT Token"))
    return next()
}

module.exports = {
    createToken,
    verifyToken,
    Id,
    HTTPError,
    isAuthenticated,
    removeDuplicates
}