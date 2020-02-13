const Collection = require("../../data/orm")
const { Response, ResponseError, removeDuplicates } = require("../../utils")
const allReqs = ["nin", "nationalid", "driverslicense", "certofownership", "tin", "intlpassport"]
const Account = Collection("accounts")

module.exports = async request => {
    const { id, userType } = request.payload
    let { requirements } = request.body

    if (userType !== 'business') throw new ResponseError(400, "You must be a business to add vendor requirements")
    if (!requirements) throw new ResponseError(400, "You must provide requirements")

    const reqs = requirements.split("|")
    for (let req of reqs) {
        if (!allReqs.includes(req)) throw new ResponseError(400, `Invalid requirement: requirement must be one of ${allReqs.join(", ")}`)
    }
    vendorReqs = removeDuplicates(reqs)
    await Account.update({ _id: id }, { vendorRequirements: vendorReqs.join("|") })
    return new Response(200, {
        error: false,
        message: "Requirements have been updated"
    })
}