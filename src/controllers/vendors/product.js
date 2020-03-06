const Collection = require("../../data/orm")
const { Response, ResponseError } = require("../../utils")

const Account = Collection("accounts")

module.exports.add = async request => {
    const { id } = request.payload
    const { name, description, price, oem} = request.body

    
}