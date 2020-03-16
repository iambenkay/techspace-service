const c = require("../../data/collections")
const { Response, ResponseError } = require("../../utils")
const V = require("../../services/validator")

module.exports.create = async request => {
    const { id } = request.payload
    const { title, description, full_description_document, category, deadline, location, quantity } = request.body

    V.allExist(
        "You must provide title, description, category, deadline, location, quantity",
        title,
        deadline,
        description,
        category,
        location,
        quantity
    )
    const rfq_data = {
        title,
        deadline,
        description,
        service_category,
        business_category,
        location,
        quantity,
        initiator: id,
    }
    if(full_description_document) rfq_data.full_description_document = full_description_document
    const data = await c.rfq.insert(rfq_data)
    return new Response(201, {
        error: false,
        ...data
    })
}

module.exports.destroy = async request => {
    const { id: rfqId } = request.body

    const rfq = await c.rfq.find({ _id: rfqId })

    if (!rfq) throw new ResponseError(400, "The RFQ does not exist")

    await c.rfq.remove({ _id: rfqId })

    return new Response(200, {
        error: false,
        message: "The RFQ has been deleted"
    })
}

module.exports.retrieveAll = async request => {
    const { id } = request.payload

    const rfqs = await c.rfq.findAll({ business: id })

    const data = rfqs.map(({ title, quantity, id }) => ({ title, quantity, id }))

    return new Response(200, {
        error: false,
        data
    })
}

module.exports.retrieve = async request => {
    const { id } = request.params

    const data = await c.rfq.find({ _id: id })

    return new Response(200, {
        error: false,
        data
    })
}

module.exports.explore = async request => {
    const { id } = request.payload
    const vendor = await c.accounts.find({ _id: id })
    const data = await c.rfq.aggregate([
        { $match: { category: vendor.service_category } },
        {
            $lookup: {
                from: "accounts",
                localField: "initiator",
                foreignField: "_id",
                as: "business"
            }
        },
        {
            $unwind: "$business",
        }
    ]).then(rfqs => rfqs.map(({
        title,
        business: {
            name,
            _id: id
        }
    }) => ({
        title,
        name,
        id
    })))

    return new Response(200, {
        error: false,
        data
    })
}
