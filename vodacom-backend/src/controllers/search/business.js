const Collection = require("../../data/orm")
const { Response, ResponseError } = require("../../utils")

const Account = Collection("accounts")

module.exports = async request => {
    const { q: searchQuery, by = "name" } = request.query
    if (!searchQuery) throw new ResponseError(400, "You must send a query")

    const businesses = await Account.findAll({
        [by]: new RegExp(searchQuery, "i"),
        userType: "business",
        registration_completed: true
    }).then(x => x.map(({
        id,
        name,
        email,
        location
    }) => ({
        id,
        email,
        name,
        location
    })))

    return new Response(200, {
        error: false,
        businesses
    })
}
