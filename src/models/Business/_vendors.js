const c = require("../../data/collections");

module.exports = (category, except, objects) => {
  const match_query = {
    businessId: objects.id
  };
  if (category) match_query.business_category = category;
  if (except) match_query.business_category = { $not: { $eq: category } };
  return c.business_vendor_rel
    .aggregate([
      {
        $match: match_query
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
      }
    ])
    .then(vendors =>
      vendors.map(
        ({
          vendor: { name, email, userType, service_category, service_location },
          accepted,
          dateJoined,
          business_category,
          vendorId
        }) => ({
          vendorId,
          name,
          email,
          userType,
          accepted,
          dateJoined,
          business_category,
          service_category,
          service_location
        })
      )
    );
};
