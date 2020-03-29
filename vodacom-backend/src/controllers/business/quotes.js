const c = require("../../data/collections");
const { Response, ResponseError } = require("../../utils");

module.exports.accept = async request => {
  const { id } = request.payload;
  const { id: quote_id } = request.body;
  if (!quote_id) throw new ResponseError(400, "You must provide id");
  const quote = await c.vendor_rfq_rel.find({ _id: quote_id, business_id: id });
  if (!quote) throw new ResponseError(404, "There is no quote with that id");

  await c.vendor_rfq_rel.update({ _id: quote_id }, { accepted: true });
  await c.vendor_rfq_rel.update(
    { _id: { $not: new RegExp(`^${quote_id}$`, "i") } },
    { accepted: false }
  );
  return new Response(200);
};

module.exports.getOne = async request => {
  const { id } = request.payload;
  const { id: quote_id } = request.params;
  if (!quote_id) throw new ResponseError(400, "You must provide quote_id");

  const quote = await c.vendor_rfq_rel.find({ _id: quote_id, business_id: id });
  if (!quote) throw new ResponseError(404, "There is no quote with that id");

  return new Response(200, {
    error: false,
    quote: quote
  });
};

module.exports.get = async request => {
  const { id } = request.payload;
  let { flag } = request.query;
  if (flag === "accepted") flag = true;
  else flag = false;
  console.log(flag);
  const quotes = await c.vendor_rfq_rel.aggregate([
    { $match: { business_id: id, accepted: flag } },
    {
      $lookup: {
        from: "accounts",
        localField: "vendor_id",
        foreignField: "_id",
        as: "vendor"
      }
    },
    { $unwind: "$vendor" },
    {
      $lookup: {
        from: "rfqs",
        localField: "rfq_id",
        foreignField: "_id",
        as: "rfq"
      }
    },
    { $unwind: "$rfq" },
    {
      $project: {
        price: true,
        quantity: true,
        delivery_date: true,
        "rfq.title": true,
        location: true,
        oem: true,
        description: true,
        "vendor.name": true,
        "vendor._id": true
      }
    }
  ]);

  return new Response(200, {
    error: false,
    quotes
  });
};
