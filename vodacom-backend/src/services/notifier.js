const c = require("../data/collections");
const {pubnub} = require("./provider")

class Notification {
  constructor(message, user, type, action) {
    this.message = message;
    this.user = user;
    this.type = type;
    this.action = action;
  }
  static create(notifications) {
      notifications.forEach(async ({message, user, type, action}) => {
         const a = await c.notifications.insert({
              message,
              user,
              type,
              action
          });
          pubnub.publish({
            message: a,
            channel: `notifications-${a.user}`,
          })
      });
  }
  static async read(id) {
    await Notifications.update({ _id: id }, { read: true });
  }
  main(){}
}

module.exports = Notification;
