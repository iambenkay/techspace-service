require("dotenv").config()
const { CLIENT_APP } = process.env
const Business_Vendor_Rel = require("../data/orm")("business-vendor-rel")

module.exports = async (request, response) => {
    const { token: invite_token } = request.query

    const modified = await Business_Vendor_Rel.update({ invite_token }, { accepted: true })
    const bvr = await Business_Vendor_Rel.find({invite_token})
    return modified
        ? response.redirect(`${CLIENT_APP}/fulfill-requirements?business=${bvr.businessId}`)
        : response.redirect(CLIENT_APP)
}

// http://localhost:3000/vendor-invite?token=ebc665db90d8581e1dcaf6d5a93f6486
