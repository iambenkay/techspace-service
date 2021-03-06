const Collection = require("../../data/orm");
const Notification = require("../../services/notifier");
const { ResponseError, Response } = require("../../utils");

const Account = Collection("accounts");
const Business_Vendor_Rel = Collection("business-vendor-rel");

module.exports.retrieveAll = async (request) => {
  const { id } = request.payload;
  const { pending } = request.query;
  const q = { vendorId: id };
  if (pending) q.accepted = pending === "1" ? false : true;
  const businesses = await Business_Vendor_Rel.aggregate([
    {
      $match: q,
    },
    {
      $lookup: {
        from: "accounts",
        localField: "businessId",
        foreignField: "_id",
        as: "business",
      },
    },
    {
      $unwind: "$business",
    },
  ]);
  return new Response(200, {
    error: false,
    businesses: businesses.map(
      ({
        business: { name, email, userType, avatar },
        accepted,
        dateJoined,
        business_category,
        businessId,
      }) => ({
        businessId,
        name,
        email,
        userType,
        avatar,
        accepted,
        dateJoined,
        business_category,
      })
    ),
  });
};

module.exports.retrieve = async (request) => {
  const { id } = request.payload;
  const { id: businessId } = request.params;
  const businesses = await Business_Vendor_Rel.aggregate([
    {
      $match: { businessId, vendorId: id },
    },
    {
      $lookup: {
        from: "accounts",
        localField: "businessId",
        foreignField: "_id",
        as: "business",
      },
    },
    {
      $unwind: "$business",
    },
    {
      $project: {},
    },
  ]);
  request.V.expr(
    "The business is not tied to this vendor account",
    businesses.length
  );
  return new Response(200, {
    error: false,
    business: (({
      business: { name, email, userType, avatar },
      accepted,
      dateJoined,
      businessId,
    }) => ({
      businessId,
      name,
      email,
      avatar,
      userType,
      accepted,
      dateJoined,
    }))(businesses[0]),
  });
};

module.exports.destroy = async (request) => {
  const { id } = request.payload;
  const { email } = await Account.find({ _id: id });
  const { email: businessEmail } = request.body;
  if (!businessEmail)
    throw new ResponseError(400, "Business email was not provided");
  const business = await Account.find({ email: businessEmail });
  if (!business)
    throw new ResponseError(
      400,
      "You can't remove a non-existent business account"
    );
  const isATiedBusiness = await Business_Vendor_Rel.find({
    businessId: business.id,
    vendorId: id,
  });
  if (!isATiedBusiness)
    throw new ResponseError(400, "Business is not tied to your vendor account");
  await Business_Vendor_Rel.remove({ businessId: business.id, vendorId: id });
  return new Response(
    200,
    {
      error: false,
      message: "You have detached from this business",
    },
    [
      new Notification(
        `The vendor ${email} detached from your business account`,
        business.id,
        "accounts",
        null,
        "Vendor removed your business"
      ),
      new Notification(
        `You dissociated from the business run by ${businessEmail}`,
        id,
        "accounts",
        null,
        "Removed business"
      ),
    ]
  );
};
