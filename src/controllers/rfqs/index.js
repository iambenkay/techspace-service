const Collection = require("../../data/orm")
const { Response, ResponseError } = require("../../utils")
const V = require("../../services/validator")

const RFQ = Collection("rfqs")

module.exports.create = async request => {
    const { id } = request.payload
    const { title, description, category, deadline, location, quantity } = request.body

    V.allExist(
        "You must provide title, description, category, deadline, location, quantity",
        title,
        deadline,
        description,
        category,
        location,
        quantity
    )
    const data = await RFQ.insert({
        title,
        deadline,
        description,
        category,
        location,
        quantity,
        business: id,
    })
    return new Response(201, {
        error: false,
        ...data
    })
}

module.exports.destroy = async request => {
    const { id: rfqId } = request.body

    const rfq = await RFQ.find({ _id: rfqId })

    if (!rfq) throw new ResponseError(400, "The RFQ does not exist")

    await RFQ.remove({ _id: rfqId })

    return new Response(200, {
        error: false,
        message: "The RFQ has been deleted"
    })
}

module.exports.retrieveAll = async request => {
    const { id } = request.payload

    const rfqs = await RFQ.findAll({ business: id })

    const data = rfqs.map(({ title, quantity, id }) => ({ title, quantity, id }))

    return new Response(200, {
        error: false,
        data
    })
}

module.exports.retrieve = async request => {
    const { id } = request.params

    const data = await RFQ.find({ _id: id })

    return new Response(200, {
        error: false,
        data
    })
}
