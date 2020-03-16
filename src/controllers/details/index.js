const c = require("../../data/collections")
const { Response, ResponseError } = require("../../utils")

module.exports.business = async request => {
    const { id } = request.params

    const business = await c.accounts.find({ _id: id, userType: "business" })

    if (!business) throw new ResponseError(404, "business does not exist")

    return new Response(200, {
        error: false,
        business: {
            id: business.id,
            name: business.name,
            email: business.email,
            userType: business.userType,
            phone: business.phone,
            location: business.location,
        }
    })
}

module.exports.vendor = async request => {
    const { id } = request.params

    const vendor = await c.accounts.find({ _id: id, userType: "vendor", registration_completed: true })

    if (!vendor) throw new ResponseError(404, "vendor does not exist")

    return new Response(200, {
        error: false,
        vendor: {
            id: vendor.id,
            name: vendor.name,
            email: vendor.email,
            userType: vendor.userType,
            phone: vendor.phone,
            service_category: vendor.service_category,
            service_location: vendor.service_location,
        }
    })
}
