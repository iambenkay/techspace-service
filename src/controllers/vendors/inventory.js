const Collection = require("../../data/orm")
const { Response, ResponseError } = require("../../utils")
const V = require("../../services/validator")

const Inventory = Collection("inventory")

module.exports.add = async request => {
    const { id } = request.payload
    const { name, description, price, oem } = request.body

    V.allExist("You must provide name, description, price and oem", name, description, price, oem)

    const data = await Inventory.insert({
        name,
        description,
        price,
        oem,
        vendorId: id,
    })
    delete data
    return new Response(200, {
        error: false,
        message: "Product has been succesfully added to Inventory",
        data
    })
}

module.exports.remove = async request => {
    const { id } = request.payload
    const { productId } = request.body
    const product = await Inventory.find({ _id: productId })
    if(!product) throw new ResponseError(404, "There is no product that matches your query")
    if (product.vendorId !== id) throw new ResponseError(401, "You are not authorized to delete this product")
    await Inventory.remove({ _id: productId })
    return new Response(200, {
        error: false,
        message: "Product has been succesfully removed from Inventory",
    })
}