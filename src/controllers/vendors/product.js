const Collection = require("../../data/orm")
const { Response, ResponseError } = require("../../utils")
const V = require("../../services/validator")

const Product = Collection("products")

module.exports.add = async request => {
    const { id } = request.payload
    const { name, description, price, oem} = request.body

    V.allExist("You must provide name, description, price and oem", name, description, price, oem)

    const data = await Product.insert({
        name,
        description,
        price,
        oem
    })

    
}