const c = require("../../data/collections");
const { ModelError } = require("../model");
const { RndToken } = require("../../services/provider");

module.exports = async (email, objects) => {
  let user = await c.accounts.find({ email });
  if (!user)
    user = await c.accounts.insert({
      email,
      isVerified: false,
      userType: "regular",
      registration_completed: false
    });
  if (user.id === objects.id)
    throw new ModelError("You are already a super admin");
  if (user.userType !== "regular")
    throw new ModelError("Email is not registered as a regular user");

  const already_belongs_to_other_business = await c.business_admin_rel.find({
    userId: user.id,
    businessId: new RegExp(`^((?!${objects.id}).)*$`, "gi")
  });
  if (already_belongs_to_other_business)
    throw new ModelError("Admin already registered with another business");

  const invitation_in_progress = await c.business_admin_rel.find({
    businessId: objects.id,
    userId: user.id,
    accepted: false
  });
  if (invitation_in_progress)
    throw new ModelError("Invitation already in progress");

  const already_an_admin = await c.business_admin_rel.find({
    businessId: objects.id,
    userId: user.id,
    accepted: true
  });
  if (already_an_admin)
    throw new ModelError("Already an admin of your business");
  const invite_token = RndToken();

  await c.business_admin_rel.insert({
    businessId: objects.id,
    userId: user.id,
    accepted: false,
    dateJoined: null,
    invite_token
  });
  return invite_token;
};
