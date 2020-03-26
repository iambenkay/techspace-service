const { Response } = require("../../utils")
const Notification = require("../../services/notifier")
const Notifications = require("../../data/orm")("notifications")

module.exports.read = async request => {
    // TODO: Enforce ownership before access (OBA)
    const {id} = request.query
    
    await Notification.read(id)

    return new Response(200, {
        error: false,
    })
}

module.exports.retrieve = async request => {
    const {id} = request.payload

    const notifications = await Notifications.findAll({user: id})

    return new Response(200, {
        error: false,
        notifications
    })
}