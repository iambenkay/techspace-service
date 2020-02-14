const Collection = require("../../data/orm")
const { Response, ResponseError } = require("../../utils")
const Notifications = Collection("notifications")

class Notification {
    static create(message, user){
        Notifications.insert({
            message,
            user,
            read: false
        })
    }
    async static read(id){
        Notifications.update({_id: id}, {read: true})
    }
}

module.exports.readNotification = async request => {
    const {id} = request.params
    
    await Notification.read(id)

    return new Response(200, {
        error: false,
    })
}

module.exports.Notification = Notification