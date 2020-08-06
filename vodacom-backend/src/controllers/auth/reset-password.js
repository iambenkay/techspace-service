const c = require("../../data/collections");
const bcrypt = require("bcryptjs");
const { ResponseError, Response } = require("../../utils");
const tokeniser = require("../../services/tokeniser");
const SendMail = require("../../services/mailer");

module.exports = async (request) => {
  const { token, password } = request.body;
  request.V.allExist("You must provide password and token", password, token);

  const payload = tokeniser.decode(token);
  if (payload === null || payload.purpose !== "reset-password") {
    throw new ResponseError(
      400,
      "The password reset token is invalid or has expired"
    );
  }
  const data = await c.accounts.update(
    { email: payload.email },
    { password: bcrypt.hashSync(password) }
  );

  return new Response(201, {
    error: false,
    ...data,
    token,
  });
};
