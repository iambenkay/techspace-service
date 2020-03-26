const c = require("../../data/collections");
const { Response } = require("../../utils");

module.exports = async request => {
  const { id } = request.payload;

  const user = await c.accounts.find({ _id: id });

  delete user.password;

  return new Response(200, user);
};
