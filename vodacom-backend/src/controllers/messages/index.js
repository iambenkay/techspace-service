const c = require("../../data/collections");
const { ResponseError, Response } = require("../../utils");
const { pubnub } = require("../../services/provider");

module.exports.createHead = async request => {
  const { id: accountId, userType } = request.payload;
  const { id, type } = request.body;
  request.V.matchesRegex(
    "type must be one of regular, business and vendor",
    type,
    /^(business|regular|vendor)$/
  );
  if (type === userType)
    throw new ResponseError(400, "Can't be the same account type");
  if (type === "regular" && userType === "vendor")
    throw new ResponseError(
      "You can't setup a chat with a regular user asa vendor"
    );
  const exists = await c.message_head.find({
    [`${type}Id`]: id,
    [`${userType}Id`]: accountId
  });
  if (!exists) {
    await c.message_head.insert({
      [`${type}Id`]: id,
      [`${userType}Id`]: accountId
    });
  }
  return new Response(200, {
    error: false,
    message: "Message head created sucessfully"
  });
};

module.exports.create = async request => {
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
  [sender, receiver].forEach(x => {
    if (![exists.vendorId, exists.businessId, exists.regularId].includes(x))
      throw new ResponseError();
  });
  const msg = await c.messages.insert({
    message,
    sender,
    receiver,
    head_id
  });
  pubnub.publish({
    message: msg,
    channel: receiver
  });
  return new Response(200, {
    error: false
  });
};

module.exports.fetchHead = async request => {
  const { id, userType } = request.payload;
  let query;
  switch (userType) {
    case "business":
    case "regular":
      query = [
        {
          $lookup: {
            from: "accounts",
            localField: "vendorId",
            foreignField: "_id",
            as: "vendor"
          }
        },
        { $unwind: "$vendor" },
        {
          $project: {
            "vendor.name": true,
            "vendor._id": true
          }
        }
      ];
      break;
    case "vendor":
      query = [
        {
          $lookup: {
            from: "accounts",
            localField: "businessId",
            foreignField: "_id",
            as: "business"
          }
        },
        { $unwind: "$business" },
        {
          $lookup: {
            from: "accounts",
            localField: "regularId",
            foreignField: "_id",
            as: "regular"
          }
        },
        { $unwind: "$regular" },
        {
          $project: {
            "business.name": true,
            "business._id": true,
            "regular.name": true,
            "regular._id": true
          }
        }
      ];
      break;
  }
  const heads = await c.message_head.aggregate([
    { $match: { [`${userType}Id`]: id } },
    ...query
  ]);
  const data = [];
  for (let head of heads) {
    const last_message = await c.messages.find_latest({ head_id: head.id });
    data.push({
      last_message,
      ...head
    });
  }
  console.log(data);
  return new Response(200, {
    error: false,
    data
  });
};

module.exports.fetch = async request => {
  const { head_id } = request.query;

  const messages = await c.messages.findAll({ head_id });

  return new Response(200, {
    error: false,
    messages
  });
};
