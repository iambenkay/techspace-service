const jwt = require("jsonwebtoken")
const cuid = require("cuid")
const Notification = require("./notifier")

const JWT_SECRET_KEY = "extremelysecretkey"

function createToken(payload) {
    return jwt.sign(payload, JWT_SECRET_KEY)
}
function removeDuplicates(list) {
    const result = []
    for (let i of list) {
        if (!result.includes(i)) result.push(i)
    }
    return result
}


function verifyToken(token) {
    try {
        return jwt.verify(token, JWT_SECRET_KEY)
    } catch {
        return null
    }
}

function HTTPError(message){
    return {
        error: true,
        message
    }
}

class ResponseError extends Error {
    constructor(status, message) {
        super(message)
        this.status = status
    }
}

class Response {
    constructor(status, data, notifications = null) {
        this.status = status
        this.data = data
        this.notifications = notifications
    }
}

function handler(controller) {
    return async (request, response) => {
        try {
            let x = await controller(request)
            if(x.notifications){
                for (let user in x.notifications.content){
                    await Notification.create(x.notifications.content[user], user, x.notifications.type)
                }
            }
            return response.status(x.status).send(x.data)
        } catch (error) {
            if (error instanceof ResponseError) return response.status(error.status).send({
                error: true,
                message: error.message,
            })
            return response.status(500).send(`${error.message} - ${error.stack}`)
        }
    }
}

module.exports = {
    createToken,
    verifyToken,
    ResponseError,
    Response,
    handler,
    HTTPError,
    removeDuplicates
}