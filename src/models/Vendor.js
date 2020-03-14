const { Model, ModelError } = require("./model")
const c = require("../data/collections")
const { RndToken } = require("../services/provider")

module.exports = class Vendor extends Model {
    constructor(data) {
        super(data)
    }
    get objects() {
        return this._data
    }
    async apply_to_business(email, requirements = {}) {
        const business = c.accounts.find({email})
        if(!business ||business.userType !== 'business') throw new ModelError("This email does not belong to a business account")

        const application_in_progress = await c.business_vendor_rel.find({
            vendorId: this.objects.id,
            businessId: business.id,
            accepted: false
        })
        if (application_in_progress) throw new ModelError("Application already in progress")

        const already_a_vendor = await c.business_vendor_rel.find({
            businessId: this.objects.id,
            vendorId: vendor.id,
            accepted: true
        })
        if (already_a_vendor) throw new ModelError("Already a vendor at this business")

        let satisfied = true;
        if(business.requirements){
            for(let i of business.requirements){
                if(!(i in requirements) || !requirements[i]) {
                    satisfied = false;
                    break;
                }
            }
        }
        if(!satisfied) throw new ModelError("You have to provide all the requirements")

        const invite_token = RndToken()
        await c.business_vendor_rel.insert({
            businessId: business.id,
            vendorId: this.objects.id,
            accepted: false,
            dateJoined: null,
            business_category: null,
            invite_token,
            initiator: this.objects.id
        })
        return invite_token
    }
}
