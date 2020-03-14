

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

module.exports = {
    ResponseError,
    Response,
}
