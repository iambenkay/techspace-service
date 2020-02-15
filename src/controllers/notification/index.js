const Collection = require("../../data/orm")
const { Response, ResponseError } = require("../../utils")
const Notifications = Collection("notifications")

module.exports.readNotification = async request => {
    const {id} = request.params
    
    await Notification.read(id)

    return new Response(200, {
        error: false,
    })
}

module.exports.Notification = Notification