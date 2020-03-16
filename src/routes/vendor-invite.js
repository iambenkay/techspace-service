require("dotenv").config()
const { CLIENT_APP } = process.env
const c = require("../data/collections")

module.exports = async (request, response) => {
    const { token: invite_token } = request.query

    const modified = await c.business_vendor_rel.update({ invite_token }, { accepted: true })
    const bvr = await c.business_vendor_rel.find({invite_token})
    const vendor = await c.accounts.find({_id: bvr.vendorId})
    return modified
        ? response.redirect(`${CLIENT_APP}/register?type=${vendor.userType}&email=${vendor.email}`)
        : response.redirect(CLIENT_APP)
}

// http://localhost:3000/vendor-invite?token=ebc665db90d8581e1dcaf6d5a93f6486
