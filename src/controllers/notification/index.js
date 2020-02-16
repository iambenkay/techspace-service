const { Response } = require("../../utils")
const Notification = require("../../utils/notifier")

module.exports = async request => {
    // TODO: Enforce ownership before access (OBA)
    const {id} = request.query
    
    await Notification.read(id)

    return new Response(200, {
        error: false,
    })
}