const Collection = require("../../data/orm")
const { Response, ResponseError, removeDuplicates } = require("../../utils")
const Notifications = Collection("notifications")

class Notification {
    static create(message, user){
        Notifications.insert({
            message,
            user,
        })
    }
    static read(id){
        Notifications.update({_id: id}, {read: true})
    }
}