const Notification = require("./notifier")
const {ResponseError} = require("../utils")

module.exports = (controller) => {
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
