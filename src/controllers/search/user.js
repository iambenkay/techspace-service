const Collection = require("../../data/orm")
const { Response, ResponseError } = require("../../utils")

const Account = Collection("accounts")

module.exports = async request => {
    const { q: searchQuery, by = "name" } = request.query
    if (!searchQuery) throw new ResponseError(400, "You must send a query")

    const businesses = await (await Account.findAll({ [by]: new RegExp(searchQuery, "i"), userType: "regular" })).map(({ id, name = "", email }) => ({ id, name, email }))

    return new Response(200, {
        error: false,
        businesses
    })
}