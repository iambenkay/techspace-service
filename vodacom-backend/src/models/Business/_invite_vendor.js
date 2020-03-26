const c = require("../../data/collections");
const { ModelError } = require("../model");
const { RndToken } = require("../../services/provider");

module.exports = async (email, objects) => {
    let vendor = await c.accounts.find({ email });
    if (!vendor)
      vendor = await c.accounts.insert({
        email,
        isVerified: false,
        userType: "vendor",
        invited: true
      });
    if (vendor.userType !== "vendor")
      throw new ModelError("Email is not registered as a vendor");

    const invitation_in_progress = await c.business_vendor_rel.find({
      businessId: objects.id,
      vendorId: vendor.id,
      accepted: false
    });
    if (invitation_in_progress)
      throw new ModelError("Invitation already in progress");

    const already_a_vendor = await c.business_vendor_rel.find({
      businessId: objects.id,
      vendorId: vendor.id,
      accepted: true
    });
    if (already_a_vendor)
      throw new ModelError("Already a vendor at your business");

    const invite_token = RndToken();
    await c.business_vendor_rel.insert({
      businessId: objects.id,
      vendorId: vendor.id,
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
  }
