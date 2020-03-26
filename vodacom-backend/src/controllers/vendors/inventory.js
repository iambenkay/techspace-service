const c = require("../../data/collections");
const { Response, ResponseError } = require("../../utils");
const V = require("../../services/validator");

module.exports.add = async request => {
  const { id } = request.payload;
  const { name, description, price, oem, type } = request.body;

  V.allExist(
    "You must provide name, description, price oem and type",
    name,
    description,
    price,
    type
  );
  request.V.expr(
    "type must be product or service",
    /^(product|service)$/i.test(type)
  );
  if (type === "product") {
    request.V.allExist("You must provide oem for product", oem);
  }
  const a = {
    name,
    description,
    price,
    vendorId: id,
    type
  };
  if (oem) a.oem = oem;
  const data = await c.inventory.insert(a);
  return new Response(200, {
    error: false,
    message: `${type[0].toUpperCase()}${type[0].slice(
      1
    )} has been succesfully added to Inventory`,
    data
  });
};

module.exports.remove = async request => {
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
    message: `Product has been succesfully removed from Inventory`
  });
};

module.exports.retrieveAll = async request => {
  let { id, userType } = request.payload;
  if (userType === "business") id = request.query.id;
  if (!id) throw new ResponseError(400, "There is no vendor with that ID");
  const data = await c.inventory.findAll({ vendorId: id });

  return new Response(200, {
    error: false,
    data
  });
};

module.exports.retrieve = async request => {
  const { id: productId } = request.body;
  const data = await c.inventory.find({ _id: productId });
};
