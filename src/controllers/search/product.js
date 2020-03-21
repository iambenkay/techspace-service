const c = require("../../data/collections")
const { Response, ResponseError } = require("../../utils")

module.exports = async request => {
    const { q: searchQuery, by = "name" } = request.query
    if (!searchQuery) throw new ResponseError(400, "You must send a query")

    const products = await c.inventory.findAll({ [by]: new RegExp(searchQuery, "i") }).then(x => {
        return x.map(({ id, name, description, oem }) => ({ id, name, description, price, oem }))
    })

    return new Response(200, {
        error: false,
        products
    })
}
