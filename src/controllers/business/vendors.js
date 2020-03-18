const c = require("../../data/collections");
const { Business } = require("../../models");
const { ResponseError, Response } = require("../../utils");

module.exports.retrieve = async request => {
  const { id } = request.payload;
  const { category } = request.query;
  const business_data = await c.accounts.find({ _id: id });
  const business = new Business(business_data);

  return new Response(200, {
    error: false,
    vendors: await business.vendors(category)
  });
};

module.exports.destroy = async request => {
  const { id } = request.payload;
  const { email } = await c.accounts.find({ _id: id });
  const { email: vendorEmail } = request.body;
  if (!vendorEmail)
    throw new ResponseError(400, "Vendor email was not provided");
  const vendor = await c.accounts.find({ email: vendorEmail });
  if (!vendor)
    throw new ResponseError(
      400,
      "You can't remove a non-existent vendor account"
    );
  const isAVendorOf = await c.business_vendor_rel.find({
    businessId: id,
    vendorId: vendor.id
  });
  if (!isAVendorOf)
    throw new ResponseError(400, "Vendor is not a part of your business");
  await c.business_vendor_rel.remove({ businessId: id, vendorId: vendor.id });
  return new Response(
    200,
    {
      error: false,
      message: "You have delisted this vendor"
    },
    {
      content: {
        [id]: `You removed the vendor ${vendorEmail} from your business`,
        [vendor.id]: `You were removed from the business run by ${email}`
      },
      type: "accounts"
    }
  );
};
