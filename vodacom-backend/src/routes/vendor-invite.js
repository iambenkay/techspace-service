require("dotenv").config();
const { CLIENT_APP } = process.env;
const c = require("../data/collections");

module.exports = async (request, response) => {
  const { token: invite_token } = request.query;

  const bvr = await c.business_vendor_rel.find({ invite_token });
  const vendor = await c.accounts.find({ _id: bvr.vendorId });
  if (bvr) {
    if (!vendor.registration_completed)
      return response.redirect(
        `${CLIENT_APP}/register?type=${vendor.userType}&email=${vendor.email}`
      );
    return response.redirect(`${CLIENT_APP}/login`);
  } else response.redirect(CLIENT_APP);
};
