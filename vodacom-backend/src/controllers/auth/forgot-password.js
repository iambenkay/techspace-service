const c = require("../../data/collections");
const { ResponseError, Response } = require("../../utils");
const tokeniser = require("../../services/tokeniser");
const SendMail = require("../../services/mailer");

module.exports = async (request) => {
  const { email } = request.body;
  request.V.allExist("You must provide email", email);
  const data = await c.accounts.find({ email });

  if (data === null)
    throw new ResponseError(
      400,
      "The provided email does not belong to an account"
    );

  if (!data.isVerified)
    throw new ResponseError(400, "You have not verified your email address");
  const token = tokeniser.create(
    {
      email: data.email,
      purpose: "reset-password",
    },
    {
      expiresIn: "10m",
    }
  );
  SendMail(
    [email],
    `Your password reset link is here!`,
    "<text>",
    `<div>Click the link to reset your password: <a href="${process.env.CLIENT_APP}/password/reset/${token}">${process.env.CLIENT_APP}/password/reset/${token}</a></div>`
  );
  return new Response(201, {
    error: false,
    ...data,
    token,
  });
};
