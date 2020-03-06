require("dotenv").config()
const jwt = require("jsonwebtoken")
const { JWT_SECRET_KEY } = process.env

class Token {
    /**
     * 
     * @param {Object} data
     * @returns String 
     */
    static create(data) {
        return jwt.sign(data, JWT_SECRET_KEY)
    }
    /**
     * 
     * @param {String} token
     * @returns Object 
     */
    static decode(token) {
        try {
            return jwt.verify(token, JWT_SECRET_KEY)
        } catch {
            return null
        }
    }
}

module.exports = Token