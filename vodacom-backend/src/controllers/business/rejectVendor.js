const c = require("../../data/collections");
const { Response, ResponseError } = require("../../utils");

module.exports = async (request) => {
  const { id } = request.payload;
  const { vendorId, review, comment } = request.body;
  if (review === true && !comment)
    throw new ResponseError(400, "You must send a comment for review");
  request.V.allExist("You must provide vendorId", vendorId);
  const update = { accepted: false, dateJoined: Date.now() };
  if (review === true) {
    update.rejectComment = comment;
  }
  update.rejected = true;
  await c.business_vendor_rel.update({ businessId: id, vendorId }, update);

  return new Response(200, {
    error: false,
    message:
      "Application was " + review === true ? "returned for review" : "rejected",
  });
};
