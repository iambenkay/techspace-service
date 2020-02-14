const Collection = require("../../data/orm")
const { Response, ResponseError } = require("../../utils")

const Account = Collection("accounts")

module.exports = async request => {
    const { id } = request.payload
    const { email } = request.body

    if (!email) throw new ResponseError(400, "You must provide the email of the vendor")
    const { vendorRequirements: v = "", vendors = {} } = await Account.find({ _id: id })
    const { id: vendorId, userType } = await Account.find({ email })
    if(userType !== "vendor") throw new ResponseError(400, "You must provide a valid vendor account")
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
    if(businesses.includes(id)) return new Response(200, {
        error: false,
        message: "vendor already exists"
    })
    await Account.update({ _id: vendorId }, { businesses: [id, ...businesses] })
    await Account.update({ _id: id }, { vendors: { [vendorId]: satisfied, ...vendors } })
    return new Response(200, {
        error: false,
        message: "Vendor added to business"
    })
}