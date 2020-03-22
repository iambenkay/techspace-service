const c = require("../../data/collections");
const { Response, ResponseError } = require("../../utils");
const store = require("../../services/cloudinary-provider");

module.exports = async request => {
  const { id: vId } = request.payload;

  const { businessId, type, id, value } = request.body;
  console.log(request.body)
  request.V.allExist(
    "You must provide: businessId, type and id",
    businessId,
    id,
    type
  );
  const bvr = await c.business_vendor_rel.find({
    accepted: false,
    vendorId: vId,
    businessId
  });
  let result;
  if (!bvr) throw new ResponseError(400, "You are not available for consideration.");
  if (type === "statutory") {
    request.V.expr(
      "You must provide value (0 or 1) for statutory requirements",
      [0, 1].includes(parseInt(value))
    );
    result = value === 0 ? false : true
  }
  if (type === "document") {
    request.V.allExist(
      "You must provide document for document requirements",
      request.file
    );
    if (request.file.mimetype != "application/pdf")
      throw new ResponseError(400, "You must provide only pdf files");
    const file_data = request.file.buffer.toString("base64");
    try {
      result = await store.upload(
        `data:${request.file.mimetype};base64,${file_data}`,
        "vendor_requirements"
      );
    } catch (error) {
      throw new ResponseError(400, error.message);
    }
  }
  const validReq = await c.accounts.find({
    _id: businessId,
    userType: "business",
    [`requirements.${type}.${id}`]: { $exists: true }
  });
  if (!validReq)
    throw new ResponseError(400, "The requirement is not on the business");

  await c.business_vendor_rel.update(
    { _id: bvr.id },
    { [`requirements.${type}.${id}`]: result }
  );

  return new Response(200, {
      error: false,
      message: "Requirement has been met."
  })
};
