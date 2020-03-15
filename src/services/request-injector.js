const Notification = require("./notifier")
const { ResponseError } = require("../utils")
const { ModelError } = require("../models/model")

module.exports = controller => {
    return async (request, response) => {
        try {
            let x = await controller(request)
            if (x.notifications) {
                for (let user in x.notifications.content) {
                    await Notification.create(x.notifications.content[user], user, x.notifications.type)
                }
            }
            return response.status(x.status).send(x.data)
        } catch (error) {
            console.error(error.message)
            if (error instanceof ResponseError) return response.status(error.status).send({
                error: true,
                message: error.message,
            })
            if (error instanceof ModelError) return response.status(400).send({
                error: true,
                message: error.message,
            })
            return response.status(500).send(`${error.message} - ${error.stack}`)
        }
    }
}
