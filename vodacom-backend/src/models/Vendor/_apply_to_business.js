const { ModelError } = require("../model");
const c = require("../../data/collections");
const { RndToken } = require("../../services/provider");

module.exports = async (email, objects) => {
  const business = await c.accounts.find({ email });
  if (!business || business.userType !== "business")
    throw new ModelError("This email does not belong to a business account");

  const application_in_progress = await c.business_vendor_rel.find({
    vendorId: objects.id,
    businessId: business.id,
    accepted: false
  });
  if (application_in_progress)
    throw new ModelError("Application already in progress");

  const already_a_vendor = await c.business_vendor_rel.find({
    businessId: objects.id,
    vendorId: objects.id,
    accepted: true
  });
  if (already_a_vendor)
    throw new ModelError("Already a vendor at this business");

  const invite_token = RndToken();
  await c.business_vendor_rel.insert({
    businessId: business.id,
    vendorId: objects.id,
    accepted: false,
    dateJoined: null,
    business_category: null,
    invite_token,
    initiator: objects.id,
    requirements: {
      document: {},
      statutory: {}
    }
  });
  return invite_token;
};
