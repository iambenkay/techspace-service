const c = require("../../data/collections");
const { ResponseError, Response } = require("../../utils");
const { pubnub } = require("../../services/provider");

module.exports.createHead = async (request) => {
  const { id: accountId, userType } = request.payload;
  const { id, type } = request.body;
  console.log(id);
  request.V.matchesRegex(
    "type must be one of regular, business and vendor",
    type,
    /^(business|regular|vendor)$/
  );
  if (type === userType)
    throw new ResponseError(400, "Can't be the same account type");
  if (type === "regular" && userType === "vendor")
    throw new ResponseError(
      "You can't setup a chat with a regular user as a vendor"
    );
  const exists = await c.message_head.find({
    $or: [{ senderId: id }, { receiverId: id }],
  });
  if (!exists) {
    await c.message_head.insert({
      senderId: id,
      receiverId: accountId,
    });
  }
  return new Response(200, {
    error: false,
    message: "Message head created sucessfully",
  });
};

module.exports.create = async (request) => {
  const { message, sender, receiver, head_id } = request.body;

  request.V.allExist(
    "You must provide message, sender, receiver and head_id",
    message,
    sender,
    receiver,
    head_id
  );
  const exists = await c.message_head.find({ _id: head_id });
  if (!exists)
    throw new ResponseError(400, "The messagehead you provided does not exist");
  [sender, receiver].forEach((x) => {
    if (![exists.senderId, exists.receiverId].includes(x))
      throw new ResponseError(400, "Not a valid chat head");
  });
  const msg = await c.messages.insert({
    message,
    sender,
    receiver,
    head_id,
  });
  pubnub
    .publish({
      message: msg,
      channel: receiver,
    })
    .then((x) => {
      console.log(x.timetoken);
    })
    .catch((x) => {
      console.error(x.message);
    });
  return new Response(200, {
    error: false,
  });
};

module.exports.fetchHead = async (request) => {
  const { id } = request.payload;
  const heads = await c.message_head.findAll({
    $or: [{ senderId: id }, { receiverId: id }],
  });
  const data = [];
  for (let head of heads) {
    console.log(head);
    const sender = await c.accounts.find({ _id: head.senderId });
    const receiver = await c.accounts.find({ _id: head.receiverId });
    const last_message = await c.messages.find_latest({ head_id: head.id });
    data.push({
      last_message,
      senderName: sender.name,
      senderId: sender.id,
      receiverId: receiver.id,
      receiverName: receiver.name,
      ...head,
    });
  }
  return new Response(200, {
    error: false,
    data,
  });
};

module.exports.fetch = async (request) => {
  const { head_id } = request.query;
  const messages = await c.messages.findAll({ head_id });

  return new Response(200, {
    error: false,
    messages,
  });
};
