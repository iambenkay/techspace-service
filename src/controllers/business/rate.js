const c = require("../../data/collections");
const { ResponseError, Response } = require("../../utils");

module.exports = async request => {
  const { id } = request.payload;
  const { vendorId, rating } = request.query;
  if (!vendorId) throw new ResponseError(400, "You must provide vendor Id");
  const modified = await c.business_vendor_rel.update(
    {
      businessId: id,
      vendorId,
      rated: false
    },
    { rated: true }
  );
  if (modified) {
    const vendor = await c.accounts.find({ _id: vendorId });
    if (!vendor)
      throw new ResponseError(400, "The vendor is not a valid vendor");
    await c.accounts.update(
      { _id: vendorId },
      {
        rating:
          ((vendor.rating || 0) * vendor.no_of_rates + rating) /
            vendor.no_of_rates +
          1,
        no_of_rates: vendor.no_of_rates + 1
      }
    );
  }
  return new Response(200, {
      error: false,
      message: "Rating was completed",
  })
};
