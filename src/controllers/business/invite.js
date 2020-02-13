const Collection = require("../../data/orm")
const { Response, ResponseError } = require("../../utils")

const Account = Collection("accounts")

module.exports = async request => {
    const { id } = request.payload
    const { email } = request.body

    if (!email) throw new ResponseError(400, "You must provide the email of the vendor")
    const { vendorRequirements: v = "", id: businessId, vendors = {} } = await Account.find({ _id: id })
    const { id: vendorId } = await Account.find({ email })
    const vendorRequirements = v.split("|")
    let satisfied = true
    for (let r of vendorRequirements) {
        if (!r) break
        const hasDoc = await Collection(r).find({ owner: vendorId }).then(user => !!user)
        if (!hasDoc) {
            satisfied = false
            break;
        }
    }
    const { businesses = [] } = await Account.find({ _id: vendorId })
    await Account.update({ _id: vendorId }, { businesses: [businessId, ...businesses] })
    await Account.update({ _id: id }, { vendors: { [id]: satisfied, ...vendors } })
    return new Response(200, {
        error: false,
        message: "Vendor added to business"
    })
}