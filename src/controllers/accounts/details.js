const Collection = require("../../data/orm")
const { Response } = require("../../utils")

const Account = Collection("accounts")

module.exports = async request => {
    const { id } = request.payload

    const user = await Account.find({ _id: id })

    delete user.password

    return new Response(200, user)
}