const c = require("../../data/collections");
const { Response, ResponseError } = require("../../utils");

module.exports = async request => {
  const { userType } = request.payload;
  const { q } = request.query;
  if(!q) throw new ResponseError(400, "You must provide a query")

  const data = {};
  if (userType === "business") {
    data.no_of_searched_vendors = (
      await c.accounts.findAll({
        userType: "vendor",
        registration_completed: true,
        name: new RegExp(q, "i")
      })
    ).length;
    data.no_of_searched_products = (
      await c.inventory.findAll({
        name: RegExp(q, "i")
      })
    ).length;
    data.no_of_searched_services = (
      await c.accounts.findAll({
        userType: "vendor",
        service_category: RegExp(q, "i"),
        registration_completed: true
      })
    ).length;
  }
  return new Response(200, {
    error: false,
    data
  });
};
