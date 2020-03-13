const Collection = require("../../data/orm")
const { ResponseError, Response } = require("../../utils")

const Account = Collection("accounts")
const Business_Vendor_Rel = Collection("business-vendor-rel")

module.exports.retrieve = async request => {
    const { id } = request.payload
    const vendors = await Business_Vendor_Rel.aggregate(
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
    )
    return new Response(200, {
        error: false,
        vendors: vendors.map(({
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

        }))
    })
}

module.exports.destroy = async request => {
    const { id } = request.payload
    const { email } = await Account.find({ _id: id })
    const { email: vendorEmail } = request.body
    if (!vendorEmail) throw new ResponseError(400, "Vendor email was not provided")
    const vendor = await Account.find({ email: vendorEmail })
    if (!vendor) throw new ResponseError(400, "You can't remove a non-existent vendor account")
    const isAVendorOf = await Business_Vendor_Rel.find({ businessId: id, vendorId: vendor.id })
    if (!isAVendorOf) throw new ResponseError(400, "Vendor is not a part of your business")
    await Business_Vendor_Rel.remove({ businessId: id, vendorId: vendor.id })
    return new Response(200, {
        error: false,
        message: "You have delisted this vendor"
    }, {
        content: {
            [id]: `You removed the vendor ${vendorEmail} from your business`,
            [vendor.id]: `You were removed from the business run by ${email}`
        }, type: "accounts"
    })
}
