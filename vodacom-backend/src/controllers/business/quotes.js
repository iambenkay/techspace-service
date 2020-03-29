const c = require("../../data/collections");
const { Response, ResponseError } = require("../../utils");

module.exports.accept = async request => {
  const { id } = request.payload;
  const { id: quote_id } = request.body;
  if (!quote_id) throw new ResponseError(400, "You must provide quote_id");
  const quote = await c.vendor_rfq_rel.find({ _id: quote_id, business_id: id });
  if (!quote) throw new ResponseError(404, "There is no quote with that id");

  await c.vendor_rfq_rel.update({ _id: quote_id }, { accepted: true });
  await c.vendor_rfq_rel.update(
    { _id: { $not: quote_id } },
    { accepted: false }
  );
  return new Response(200);
};

module.exports.getOne = async request => {
  const { id } = request.payload;
  const { id: quote_id } = request.params;
  if (!quote_id) throw new ResponseError(400, "You must provide quote_id");

  const quote = await c.vendor_rfq_rel.find({ _id: quote_id, business_id: id });
  if (!quote) throw new ResponseError(404, "There is no quote with that id");

  return new Response(200, {
    error: false,
    quote: quote
  });
};

module.exports.get = async request => {
  const { id } = request.payload;

  const quotes = await c.vendor_rfq_rel.findAll({ business_id: id });
  console.log(quotes);

  return new Response(200, {
    error: false,
    quotes
  });
};
