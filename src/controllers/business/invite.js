const Collection = require("../../data/orm")
const { Response, ResponseError } = require("../../utils")
const Mail = require("../../services/mailer")
const Account = Collection("accounts")
const Business_Vendor_Rel = Collection("business-vendor-rel")

module.exports = async request => {
    const { id } = request.payload
    const { email } = request.body

    if (!email) throw new ResponseError(400, "You must provide the email of the vendor")
    const { email: businessEmail, name } = await Account.find({ _id: id })
    const { id: vendorId, userType } = await Account.find({ email })
    if (userType !== "vendor") throw new ResponseError(400, "You must provide a valid vendor account")
    // const vendorRequirements = v.split("|")
    // let satisfied = true
    // for (let r of vendorRequirements) {
    //     if (!r) break
    //     const hasDoc = await Collection(r).find({ owner: vendorId }).then(user => !!user)
    //     if (!hasDoc) {
    //         satisfied = false
    //         break;
    //     }
    // }
    const found = await Business_Vendor_Rel.find({
        businessId: id,
        vendorId,
    })
    if (found) return new Response(200, {
        error: false,
        message: "Vendor is already a part of your business",
    })
    const { relId } = await Business_Vendor_Rel.insert({
        businessId: id,
        vendorId,
        accepted: false,
        dateJoined: null,
        business_category: null,
    })
    new Mail("\"Vendor Alliance\" <support@voda.com>",
        [email],
        `Invitation to be a vendor at ${name}!`,
        `You have been invited by ${name} (${businessEmail}) to be a vendor.` +
        "Click the link to accept the offer: https://vendor-alliance.web.app",
        `<div>You have been invited by ${name} (${businessEmail}) to be a vendor.` +
        "Click the link to accept the offer: <a href=\"https://vendor-alliance.web.app\">https://vendor-alliance.web.app</a></div>").send()
    return new Response(200, {
        error: false,
        message: "Vendor added to business"
    }, {
        content: {
            [id]: `You invited the vendor ${email} to your business`,
            [vendorId]: `You were invited to the business run by ${businessEmail}`,
        }, type: "accounts"
    })
}