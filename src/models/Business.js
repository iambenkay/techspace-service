const Model = require("./")
const c = require('../data/collections')
const {RndToken} = require("../services/provider")

module.exports = class Business extends Model {
    constructor(data) {
        super(data)
    }
    get objects(){
        return this._data
    }
    async invite_vendor(email) {
        let vendor = await c.accounts.find({email})
        if(!vendor) vendor = await c.accounts.insert({
            email,
            isVerified: false,
            userType: "vendor",
        })
        if(vendor.userType !== "vendor") throw new super.ModelError("Email is not registered as a vendor")

        const invitation_in_progress = await c.business_vendor_rel.find({
            businessId: this.objects.id,
            vendorId: vendor.id,
        })
        if(invitation_in_progress) return "Invitation already in progress"
        const invite_token = RndToken()

        await c.business_vendor_rel.insert({
            businessId: this.objects.id,
            vendorId: vendor.id,
            accepted: false,
            dateJoined: null,
            business_category: null,
            invite_token,
        })
    }
    get vendors() {
        return c.business_vendor_rel.aggregate(
            {
                "$match": { businessId: id }
            },
            {
                "$lookup": {
                    from: "accounts",
                    localField: "vendorId",
                    foreignField: "_id",
                    as: "vendor",
                },
            },
            {
                "$unwind": "$vendor",
            },
            {
                "$project": {},
            }
        ).then(vendors => vendors.map(({
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

        })))
    }
}
