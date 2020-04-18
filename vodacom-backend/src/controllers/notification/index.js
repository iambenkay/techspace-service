const { Response } = require("../../utils");
const Notification = require("../../services/notifier");
const c = require("../../data/collections");

exports.read = async (request) => {
  const { id: accountId } = request.payload;
  const { id } = request.query;
  const isOwner = await c.notifications.find({ _id: id, user: accountId });
  if (isOwner) {
    await Notification.read(id);
  }

  return new Response(200, {
    error: false,
  });
};

exports.retrieve = async (request) => {
  const { id: accountId } = request.payload;
  const notifications = await c.notifications.findFactory(
    { user: accountId },
    (a, b) => b.createdAt - a.createdAt,
    14
  );
  return new Response(200, {
    data: notifications,
  });
};
