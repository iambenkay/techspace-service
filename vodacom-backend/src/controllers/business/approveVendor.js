const c = require("../../data/collections");
const { Response, ResponseError } = require("../../utils");

exports = async request => {
  const { id } = request.payload;
  const { vendorId } = request.body;
  request.V.allExist("You must provide vendorId", vendorId);
  await c.business_vendor_rel.update(
    { businessId: id, vendorId },
    { accepted: true, dateJoined: Date.now() }
  );

  return new Response(200, {
    error: false,
    message: "Vendor has been added to business"
  });
};
