const Collection = require("../../data/orm")
const { Response, ResponseError } = require("../../utils")

const Account = Collection("accounts")

module.exports = async request => {
    const { id } = request.payload
    const { email } = request.body

    if (!email) throw new ResponseError(400, "You must provide id of the business you're trying to apply to")

    const { vendorRequirements: v = "", id: businessId, vendors = {} } = await Account.find({ email })
    const vendorRequirements = v.split("|")
    let satisified = true
    for (let r of vendorRequirements) {
        if (!r) break
        const hasDoc = await Collection(r).find({ owner: id }).then(user => !!user)
        if (!hasDoc) {
            satisified = false
            break
        }
    }

    if (!satisified) throw new ResponseError(400, `You are not qualified to apply to this business. Upload the following: ${vendorRequirements.join(", ")}`)
    const { businesses = [] } = await Account.find({ _id: id })
    await Account.update({ _id: id }, { businesses: [businessId, ...businesses] })
    await Account.update({ email }, { vendors: { [id]: true, ...vendors } })
    return new Response(200, {
        error: false,
        message: "Vendor added to business"
    })
}