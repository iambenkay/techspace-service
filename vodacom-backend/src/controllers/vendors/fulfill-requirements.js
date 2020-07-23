const c = require("../../data/collections");
const { Response, ResponseError } = require("../../utils");
const store = require("../../services/upload-provider");
const {Id} = require("../../services/provider");

module.exports.set = async (request) => {
  const { id: vId } = request.payload;
  const { existing } = request.query;

  const { businessId, type, id, value } = request.body;
  request.V.allExist(
    "You must provide: businessId, type and id",
    businessId,
    id,
    type
  );
  const bvr = await c.business_vendor_rel.find({
    accepted: false,
    vendorId: vId,
    businessId,
  });
  let result;
  if (!bvr)
    throw new ResponseError(400, "You are not available for consideration.");
  if (type === "statutory") {
    request.V.expr(
      "You must provide value (0 or 1) for statutory requirements",
      [0, 1].includes(parseInt(value))
    );
    result = parseInt(value) !== 0;
  }
  if (type === "document") {
    if (!existing) {
      request.V.allExist(
        "You must provide document for document requirements",
        request.file
      );
      if (request.file.mimetype !== "application/pdf")
        throw new ResponseError(400, "You must provide only pdf files");
      try {
        result = await store
          .upload(
            request.file,
            `vendor_requirements/${
              (bvr &&
                bvr.requirements[type] &&
                bvr.requirements[type][id] &&
                bvr.requirements[type][id].id) ||
              Id()
            }`
          )
          .then((result) => result.secure_url);
      } catch (error) {
        throw new ResponseError(400, error.message);
      }
    } else {
      request.V.allExist(
        "You must provide document for document requirements",
        request.body.document
      );
      result = request.body.document;
    }
  }
  const validReq = await c.accounts.find({
    _id: businessId,
    userType: "business",
    [`requirements.${type}.${id}`]: { $exists: true },
  });
  if (!validReq)
    throw new ResponseError(400, "The requirement is not on the business");
  await c.business_vendor_rel.update(
    { _id: bvr.id },
    {
      [`requirements.${type}.${id}`]: {
        id,
        value: result,
        accepted: null,
      },
    }
  );
  const re = await c.business_vendor_rel.find({ _id: bvr.id });
  return new Response(200, {
    error: false,
    message: "Requirement has been met.",
    result: re,
  });
};

module.exports.get = async (request) => {
  const { id } = request.payload;
  const { businessId, from, vendorId } = request.query;
  let match;
  if (from === "vendor") {
    if (!businessId)
      throw new ResponseError(400, "You must provide businessId");
    match = {
      vendorId: id,
      businessId: businessId,
    };
  }
  if (from === "business") {
    if (!vendorId) throw new ResponseError(400, "You must provide vendorId");
    match = {
      vendorId: vendorId,
      businessId: id,
    };
  }
  const bvr = await c.business_vendor_rel.find(match);

  return new Response(200, {
    error: false,
    data: bvr,
  });
};

module.exports.approve = async (request) => {
  const { id, type } = request.body;
  if (!id || !type)
    throw new ResponseError(400, "You must provide id and type");
  await c.business_vendor_rel.update(
    { [`requirements.${type}.${id}.accepted`]: { $exists: true } },
    { [`requirements.${type}.${id}.accepted`]: true }
  );

  return new Response(200, {
    error: false,
    message: "Requirement was approved",
  });
};
module.exports.reject = async (request) => {
  const { id, type } = request.body;
  if (!id || !type)
    throw new ResponseError(400, "You must provide id and type");
  await c.business_vendor_rel.update(
    { [`requirements.${type}.${id}.accepted`]: { $exists: true } },
    { [`requirements.${type}.${id}.accepted`]: false }
  );

  return new Response(200, {
    error: false,
    message: "Requirement was rejected",
  });
};
