const c = require("../../data/collections");
const { Response, ResponseError } = require("../../utils");

module.exports.post = async (request) => {
  const { id } = request.payload;

  const portfolio = Object.fromEntries(
    Object.entries(request.body).filter((x) => x[1] !== undefined)
  );
  const found = await c.portfolio.update({ owner: id }, { ...portfolio });
  if (found === null) {
    await c.portfolio.insert({ ...portfolio, owner: id });
  }

  return new Response(200, { message: "Portfolio has been set" });
};
module.exports.get = async (request) => {
  const { id } = request.payload;

  const found = await c.portfolio.find({ owner: id });
  if (found === null) {
    throw new ResponseError(404, "Portfolio not found");
  }

  return new Response(200, { portfolio: found });
};
