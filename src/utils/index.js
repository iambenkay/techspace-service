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

class ResponseError extends Error {
    constructor(status, message){
        super(message)
        this.status = status
    }
}

class Response {
    constructor(status, data){
        this.status = status
        this.data = data
    }
}

function Id(){
    return cuid()
}

function handler (controller){
    return async (request, response) => {
        try {
            let x = await controller(request)
            return response.status(x.status).send(x.data)
        } catch(error){
            if(error instanceof ResponseError) return response.status(error.status).send({
                error: true,
                message: error.message,
            })
            return response.status(500).send("Something went wrong")
        }
    }
}

module.exports = {
    createToken,
    verifyToken,
    Id,
    HTTPError,
    ResponseError,
    Response,
    handler,
    removeDuplicates
}