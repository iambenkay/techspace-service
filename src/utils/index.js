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

module.exports = {
    createToken,
    verifyToken,
    Id,
    HTTPError,
    removeDuplicates
}