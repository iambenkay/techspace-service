const c = require("../../data/collections");

module.exports = (category, except, pending, objects) => {
  const match_query = {
    businessId: objects.id
  };
  if (category) match_query.business_category = category;
  if (except) match_query.business_category = { $not: { $eq: except } };
  if (category || except) match_query.accepted = true;
  if (pending) {
    if (pending === "0") match_query.accepted = true;
    if (pending === "1") match_query.accepted = false;
  }
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
