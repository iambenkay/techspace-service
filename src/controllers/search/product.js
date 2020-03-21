const c = require("../../data/collections");
const { Response, ResponseError } = require("../../utils");

module.exports = async request => {
  const { q: searchQuery, by = "name" } = request.query;
  if (!searchQuery) throw new ResponseError(400, "You must send a query");

  const products = await c.inventory.aggregate([
    {
      $match: { [by]: new RegExp(searchQuery, "i") }
    },
    {
      $lookup: {
        from: "accounts",
        localField: "vendorId",
        foreignField: "_id",
        as: "vendor"
      }
    },
    {
      $unwind: "$vendor"
    },
    {
      $project: {
        name: true,
        price: true,
        description: true,
        oem: true,
        "vendor.name": true,
        "vendor._id": true,
        "vendor.service_category": true,
        "vendor.service_location": true,
        "vendor.email": true,
        "vendor.phone": true
      }
    }
  ]);
  return new Response(200, {
    error: false,
    products
  });
};
