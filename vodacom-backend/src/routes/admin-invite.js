require("dotenv").config();
const { CLIENT_APP } = process.env;
const c = require("../data/collections");

module.exports = async (request, response) => {
  const { token: invite_token } = request.query;

  const modified = await c.business_admin_rel.update(
    { invite_token },
    { accepted: true, dateJoined: Date.now() }
  );
  const bar = await c.business_admin_rel.find({ invite_token });
  const user = await c.accounts.find({ _id: bar.userId });
  return modified
    ? response.redirect(
        `${CLIENT_APP}/register?type=${user.userType}&email=${user.email}`
      )
    : response.redirect(CLIENT_APP);
};
