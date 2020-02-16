const { Response } = require("../../utils")
const Notification = require("../../utils/notifier")

module.exports = async request => {
    const {id} = request.params
    
    await Notification.read(id)

    return new Response(200, {
        error: false,
    })
}