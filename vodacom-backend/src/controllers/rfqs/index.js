const c = require("../../data/collections");
const { Response, ResponseError } = require("../../utils");
const V = require("../../services/validator");
const store = require("../../services/cloudinary-provider");

module.exports.create = async request => {
  const { id } = request.payload;
  const {
    title,
    description,
    category,
    type,
    deadline,
    location,
    quantity
  } = request.body;

  V.allExist(
    "You must provide title, description, category, type, deadline, location, quantity",
    title,
    deadline,
    description,
    type,
    category,
    location,
    quantity
  );

  const rfq_data = {
    title,
    deadline,
    description,
    location,
    quantity,
    initiator: id
  };
  if (type === "service") rfq_data.service_category = category;
  if (type === "business") rfq_data.business_category = category;
  if (type === "single") rfq_data.vendor = category;
  if (request.file) {
    if (request.file.mimetype != "application/pdf")
      throw new ResponseError(400, "You must provide only pdf files");
    const file_data = request.file.buffer.toString("base64");
    let result;
    try {
      result = await store.upload(
        `data:${request.file.mimetype};base64,${file_data}`,
        "rfq_description_documents"
      );
    } catch (error) {
      throw new ResponseError(400, error.message);
    }
    console.log(result);
    rfq_data.full_description_document = result.public_id;
  }

  const data = await c.rfq.insert(rfq_data);
  return new Response(201, {
    error: false,
    ...data,
    message: "RFQ has been created successfully"
  });
};

module.exports.destroy = async request => {
  const { id: rfqId } = request.body;

  const rfq = await c.rfq.find({ _id: rfqId });

  if (!rfq) throw new ResponseError(400, "The RFQ does not exist");

  await c.rfq.remove({ _id: rfqId });

  return new Response(200, {
    error: false,
    message: "The RFQ has been deleted"
  });
};

module.exports.retrieveAll = async request => {
  const { id } = request.payload;

  const rfqs = await c.rfq.findAll({ initiator: id });

  const data = rfqs.map(({ title, quantity, id }) => ({ title, quantity, id }));

  return new Response(200, {
    error: false,
    data
  });
};

module.exports.retrieve = async request => {
  const { id } = request.params;

  const data = await c.rfq.find({ _id: id });

  return new Response(200, {
    error: false,
    data
  });
};

module.exports.explore = async request => {
  const { id } = request.payload;
  const vendor = await c.accounts.find({ _id: id });
  console.log(
    { service_category: vendor.service_category },
    { vendor: vendor.id }
  );
  const data = await c.rfq.aggregate([
    {
      $match: {
        $or: [
          { service_category: vendor.service_category },
          { vendor: vendor.id }
        ]
      }
    },
    {
      $lookup: {
        from: "accounts",
        localField: "initiator",
        foreignField: "_id",
        as: "business"
      }
    },
    {
      $unwind: "$business"
    },
    {
      $project: {
        description: true,
        "business.name": true,
        title: true,
        "business._id": true
      }
    }
  ]);
  return new Response(200, {
    error: false,
    data
  });
};
