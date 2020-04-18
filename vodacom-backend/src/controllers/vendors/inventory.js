const c = require("../../data/collections");
const { Response, ResponseError } = require("../../utils");
const V = require("../../services/validator");
const { Id } = require("../../services/provider");
const store = require("../../services/cloudinary-provider");

module.exports.add = async (request) => {
  const { id } = request.payload;
  const { name, description, price, oem, type, moq, sku } = request.body;
  const { file: picture } = request;

  V.allExist(
    "You must provide name, description, price, picture and type",
    name,
    description,
    price,
    type,
    picture
  );
  const product_id = Id();
  if (!["image/jpeg", "image/png"].includes(picture.mimetype))
    throw new ResponseError(400, "You must provide only jpeg or png files");
  let result;
  const file_data = picture.buffer.toString("base64");
  try {
    result = await store
      .upload(
        `data:${picture.mimetype};base64,${file_data}`,
        "product_images",
        undefined,
        product_id
      )
      .then((result) => result.secure_url);
  } catch (error) {
    throw new ResponseError(400, error.message);
  }
  request.V.expr(
    "type must be product or service",
    /^(product|service)$/i.test(type)
  );
  if (type === "product") {
    request.V.allExist("You must provide oem for product", oem);
  }
  const a = {
    _id: product_id,
    image: result,
    name,
    description,
    price,
    vendorId: id,
    type,
    moq,
    sku,
  };
  if (oem) a.oem = oem;
  const data = await c.inventory.insert(a);
  return new Response(200, {
    error: false,
    message: `${type[0].toUpperCase()}${type.slice(
      1
    )} has been succesfully added to Inventory`,
    data,
  });
};

module.exports.remove = async (request) => {
  const { id } = request.payload;
  const { productId } = request.body;
  const product = await c.inventory.find({ _id: productId });
  if (!product)
    throw new ResponseError(404, "There is no product that matches your query");
  if (product.vendorId !== id)
    throw new ResponseError(
      401,
      "You are not authorized to delete this product"
    );
  await c.inventory.remove({ _id: productId });
  return new Response(200, {
    error: false,
    message: `Product has been succesfully removed from Inventory`,
  });
};

module.exports.retrieveAll = async (request) => {
  let { id } = request.payload;
  const { type } = request.query;
  const q = {};
  if (type) q.type = type;
  q.vendorId = id;
  const data = await c.inventory.aggregate([
    { $match: q },
    {
      $lookup: {
        from: "accounts",
        localField: "vendorId",
        foreignField: "_id",
        as: "vendor",
      },
    },
    { $unwind: "$vendor" },
    {
      $project: {
        price: true,
        name: true,
        type: true,
        oem: true,
        moq: true,
        sku: true,
        description: true,
        "vendor.name": true,
        "vendor._id": true,
      },
    },
  ]);

  return new Response(200, {
    error: false,
    data,
  });
};

module.exports.explore = async (request) => {
  let { id } = request.payload;
  const { type } = request.query;
  const q = {};
  if (type) q.type = type;
  const data = await c.inventory.aggregate([
    { $match: q },
    {
      $lookup: {
        from: "accounts",
        localField: "vendorId",
        foreignField: "_id",
        as: "vendor",
      },
    },
    { $unwind: "$vendor" },
    {
      $project: {
        price: true,
        name: true,
        type: true,
        oem: true,
        moq: true,
        sku: true,
        description: true,
        "vendor.name": true,
        "vendor._id": true,
      },
    },
  ]);
  console.log(data);

  return new Response(200, {
    error: false,
    data,
  });
};

module.exports.retrieve = async (request) => {
  const { id: productId } = request.body;
  const data = await c.inventory.find({ _id: productId });
  return new Response(200, {
    error: false,
    data,
  });
};
