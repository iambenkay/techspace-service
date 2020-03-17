const c = require("../../data/collections");
const m = require("../../models");
const { ResponseError, Response } = require("../../utils");
const Mail = require("../../services/mailer");

module.exports.create = async request => {
  const { id } = request.payload;
  const { email } = request.body;
  if (!email)
    throw new ResponseError(
      400,
      "You must provide the email of the user you want to make admin"
    );
  const business_data = await c.accounts
    .find({ _id: id })
    .then(account => account);
  const business = new m.Business(business_data);
  const invite_token = await business.invite_admin(email);
  const user = await c.accounts.find({ email });
  const host = request.get("host");
  const scheme = process.env.STATE === "development" ? "http" : "https";
  const email_ver_link = `${scheme}://${host}/admin-invite?token=${invite_token}`;
  if (process.env.STATE === "development") console.log(email_ver_link);
  new Mail(
    [email],
    `Invitation to be an admin at ${business.objects.name}!`,
    `You have been invited by ${business.objects.name} (${business.objects.email}) to be an admin.` +
      `Click the link to accept the offer: ${email_ver_link}`,
    `<div>You have been invited by ${business.objects.name} (${business.objects.email}) to be an admin.` +
      `Click the link to accept the offer: <a href="${email_ver_link}">${email_ver_link}</a></div>`
  ).send();
  return new Response(
    200,
    {
      error: false,
      message: "User was added to admins"
    },
    {
      content: {
        [id]: `You added the user ${email} to your business`,
        [user.id]: `You were added to the business run by ${business.email}`
      },
      type: "accounts"
    }
  );
};

module.exports.retrieve = async request => {
  const { id } = request.payload;
  const data = await c.business_admin_rel.aggregate([
    {
      $match: { businessId: id }
    },
    {
      $lookup: {
        from: "accounts",
        localField: "userId",
        foreignField: "_id",
        as: "admin"
      }
    },
    {
      $unwind: "$admin"
    }
  ]);
  const admins = data.map(({ accepted, admin: { name, email, id } }) => ({
    name,
    email,
    id,
    accepted
  }));

  return new Response(200, {
    error: false,
    admins
  });
};

module.exports.destroy = async request => {
  const { id } = request.payload;

  const { email } = request.body;
  if (!email)
    throw new ResponseError(
      400,
      "You need to provide an email of the admin you're trying to remove"
    );
  const user = await c.accounts.find({ email });
  if (!user) throw new ResponseError(400, "Account does not exist");
  console.log(id, user.id);
  const bar = await c.business_admin_rel.find({
    businessId: id,
    userId: user.id
  });
  if (!bar)
    throw new ResponseError(400, "This is not an admin of this business");
  if (id !== bar.businessId)
    throw new ResponseError(400, "This is not an admin of this business");
  const { email: businessEmail } = await c.accounts.find({ _id: id });
  await c.business_admin_rel.remove({ userId: user.id, businessId: id });

  return new Response(
    200,
    {
      error: false,
      message: "Admin has been delisted"
    },
    {
      content: {
        [id]: `You removed the user ${email} from your business`,
        [user.id]: `You were removed from the business run by ${businessEmail}`
      },
      type: "accounts"
    }
  );
};
