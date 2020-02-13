const Collection = require("../../data/orm")
const { ResponseError, Response } = require("../../utils")

const Account = Collection("accounts")

module.exports.create = async request => {
    const { id } = request.payload
    const { email } = request.body
    if (!email) throw new ResponseError(400, "You must provide the email of the user you want to make admin")
    const regularUser = await Account.find({ email })
    if (!regularUser || regularUser.userType !== "regular") throw new ResponseError(400, "You must provide a registered regular user account")
    const admins = await Account.find({ _id: id }).then(account => account.admins || [])
    if (regularUser.id === id) throw new ResponseError(400, "You can't add your businesss account. It is a default admin")
    if (admins.includes(regularUser.id)) throw new Response(200, {
        error: false,
        message: "Already an admin"
    })
    admins.push(regularUser.id)
    await Account.update({ _id: id }, { admins })
    await Account.update({ _id: regularUser.id }, { businessId: id })
    return new Response(200, {
        error: false,
        message: "User was added to admins"
    })
}

module.exports.retrieve = async request => {
    const { id } = request.payload
    console.log(id)
    const adminIds = await Account.find({ _id: id }).then(({admins = []}) => admins)
    const admins = []
    for (let a of adminIds){
        admins.push(await Account.find({_id: a}).then(({name, email, id}) => ({name, email, id})))
    }

    return new Response(200, {
        error: false,
        admins
    })
}

module.exports.destroy = async request => {
    const { id } = request.payload

    const { email } = request.body
    if (!email) throw new ResponseError(400, "You need to provide an email of the admin you're trying to remove")
    const admin = { _id: adminId, businessId } = await Account.find({ email })
    if (!admin) throw new ResponseError(400, "Account does not exist")
    if (businessId !== id) throw new ResponseError(400, "This is not an admin of this business")
    const { admins } = await Account.find({ _id: id })
    const index = admins.indexOf(vendorId)
    delete admins[index]
    await Account.update({ _id: id }, { admins })
    await Account.update({ _id: adminId }, { businessId: null })

    return new Response(200, {
        error: false,
        message: "Admin ha been delisted"
    })
}