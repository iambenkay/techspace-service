const Notifications = require("../data/orm")("notifications")

class Notification {
    static async create(message, user, type) {

        await Notifications.insert({
            message,
            user,
            type,
            read: false
        })
    }
    static async read(id) {
        await Notifications.update({ _id: id }, { read: true })
    }
}

module.exports = Notification