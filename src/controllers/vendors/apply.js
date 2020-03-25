const c = require("../../data/collections");
const m = require("../../models");
const Mail = require("../../services/mailer");
const { Response, ResponseError } = require("../../utils");

module.exports = async request => {
  const { id } = request.payload;
  const { email } = request.body;
  if (!email)
    throw new ResponseError(
      400,
      "You must provide email of the business you're trying to apply to"
    );
  const vendor_data = await c.accounts.find({ _id: id });
  const vendor = new m.Vendor(vendor_data);

  const invite_token = await vendor.apply_to_business(email);

  const host = request.get("host");
  const scheme = process.env.STATE === "development" ? "http" : "https";
  const email_ver_link = `${scheme}://${host}/vendor-application?token=${invite_token}`;
  if (process.env.STATE === "development") console.log(email_ver_link);
  new Mail(
    [email],
    `Application from ${vendor.objects.name} to be a part of your business!`,
    `${vendor.objects.name} (${vendor.objects.email}) applied to be a vendor at your business.` +
      `Click the link to review the application: ${email_ver_link}`,
    `${vendor.objects.name} (${vendor.objects.email}) applied to be a vendor at your business.` +
      `Click the link to review the application: <a href="${email_ver_link}">${email_ver_link}</a></div>`
  ).send();
  return new Response(200, {
    error: false,
    message: "Vendor added to business"
  });
};
