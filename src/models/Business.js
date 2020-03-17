const { Model, ModelError } = require("./model");
const c = require("../data/collections");
const { RndToken } = require("../services/provider");

module.exports = class Business extends Model {
  constructor(data) {
    super(data);
  }
  get objects() {
    return this._data;
  }
  async invite_admin(email) {
    let user = await c.accounts.find({ email });
    if (!user)
      user = await c.accounts.insert({
        email,
        isVerified: false,
        userType: "regular",
        registration_completed: false
      });
    if (user.id === this.objects.id)
      throw new ModelError("You are already a super admin");
    if (user.userType !== "regular")
      throw new ModelError("Email is not registered as a regular user");

    const already_belongs_to_other_business = await c.business_admin_rel.find({
      userId: user.id,
      businessId: new RegExp(`^((?!${this.objects.id}).)*$`, "gi")
    });
    if (already_belongs_to_other_business)
      throw new ModelError("Admin already registered with another business");

    const invitation_in_progress = await c.business_admin_rel.find({
      businessId: this.objects.id,
      userId: user.id,
      accepted: false
    });
    if (invitation_in_progress)
      throw new ModelError("Invitation already in progress");

    const already_an_admin = await c.business_admin_rel.find({
      businessId: this.objects.id,
      userId: user.id,
      accepted: true
    });
    if (already_an_admin)
      throw new ModelError("Already an admin of your business");
    const invite_token = RndToken();

    await c.business_admin_rel.insert({
      businessId: this.objects.id,
      userId: user.id,
      accepted: false,
      dateJoined: null,
      invite_token
    });
    return invite_token;
  }
  async invite_vendor(email) {
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
      businessId: this.objects.id,
      vendorId: vendor.id,
      accepted: false
    });
    if (invitation_in_progress)
      throw new ModelError("Invitation already in progress");

    const already_a_vendor = await c.business_vendor_rel.find({
      businessId: this.objects.id,
      vendorId: vendor.id,
      accepted: true
    });
    if (already_a_vendor)
      throw new ModelError("Already a vendor at your business");

    const invite_token = RndToken();
    await c.business_vendor_rel.insert({
      businessId: this.objects.id,
      vendorId: vendor.id,
      accepted: false,
      dateJoined: null,
      business_category: null,
      invite_token,
      initiator: this.objects.id
    });
    return invite_token;
  }
  get vendors() {
    return c.business_vendor_rel
      .aggregate([
        {
          $match: { businessId: this.objects.id }
        },
        {
          $lookup: {
            from: "accounts",
            localField: "vendorId",
            foreignField: "_id",
            as: "vendor"
          }
        },
        {
          $unwind: "$vendor"
        }
      ])
      .then(vendors =>
        vendors.map(
          ({
            vendor: {
              name,
              email,
              userType,
              service_category,
              service_location
            },
            accepted,
            dateJoined,
            business_category,
            vendorId
          }) => ({
            vendorId,
            name,
            email,
            userType,
            accepted,
            dateJoined,
            business_category,
            service_category,
            service_location
          })
        )
      );
  }
};
