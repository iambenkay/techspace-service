const Collection = require("../../data/orm")
const { ResponseError, Response } = require("../../utils")

const Account = Collection("accounts")

module.exports.retrieve = async request => {
    const { id } = request.payload

    const vendorIds = await Account.find({ _id: id }).then(({vendors}) => vendors)
    const vendors = []
    for(let v of Object.keys(vendorIds)){
        const vendor = await Account.find({_id: v}).then(({name, email, id}) => ({name, email, id, status: vendorIds[v]}))
        vendors.push(vendor)
    }
    return new Response(200, {
        error: false,
        vendors
    })
}

module.exports.destroy = async request => {
    const { id } = request.payload

    const { email: vendorEmail } = request.body
    if (!vendorEmail) throw new ResponseError(400, "Vendor email was not provided")
    const vendor = { businesses =[], id: vendorId } = await Account.find({ email: vendorEmail })
    if (!vendor) throw new ResponseError(400, "You can't remove a non-existent vendor account")
    const isAVendorOf = businesses.includes(id)
    if (!isAVendorOf) throw new ResponseError(400, "Vendor is not a part of your business")
    const index = businesses.indexOf(id)
    delete businesses[index]
    await Account.update({ _id: vendorId }, { businesses })
    const { vendors = {} } = await Account.find({ _id: id })
    delete vendors[vendorId]
    await Account.update({ _id: id }, { vendors })
    return new Response(200, {
        error: false,
        message: "You have delisted this vendor"
    })
}