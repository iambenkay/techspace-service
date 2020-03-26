const Collection = require("../../data/orm");
const { Response, ResponseError } = require("../../utils");

const Account = Collection("accounts");

module.exports = async request => {
  const { q: searchQuery, by = "name" } = request.query;
  if (!searchQuery) throw new ResponseError(400, "You must send a query");

  const vendors = await (
    await Account.findAll({
      [by]: new RegExp(searchQuery, "i"),
      userType: "vendor",
      registration_completed: true
    })
  ).map(
    ({
      id,
      name,
      email,
      service_category,
      phone,
      service_location,
      rating = 0
    }) => ({
      id,
      name,
      email,
      service_category,
      service_location,
      phone,
      rating
    })
  );

  return new Response(200, {
    error: false,
    vendors
  });
};
