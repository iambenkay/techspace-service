const c = require("../../data/collections")
const { Response, ResponseError } = require("../../utils")

module.exports.create = async request => {
    const { id } = request.payload

    const { price, description, quantity, delivery_date, rfq_id } = request.body

    request.V.allExist("You must provide price, description, quantity, rfq_id and delivery_date", rfq_id, price, description, quantity, delivery_date)

    const quote = await c.vendor_rfq_rel.find({
        vendor_id: id,
        rfq_id
    })
    if(quote) throw new ResponseError(400, "You have already sent a quote for this RFQ")

    await c.vendor_rfq_rel.insert({
        price,
        description,
        quantity,
        delivery_date,
        rfq_id,
        vendor_id: id
    })

    return new Response(201, {
        error: false,
        message: "Your quote has been successfully sent"
    })
}

module.exports.getOne = async request => {
    const { id } = request.payload
    const {id: quote_id} = request.params

    const quote = await c.vendor_rfq_rel.find({
        _id: quote_id,
        vendor_id: id,
    })
    if(!quote) throw new ResponseError(404, "There is no quote with that id")

    return new Response(200, {
        error: false,
        quote
    })
}

module.exports.get = async request => {
    const { id } = request.payload

    const quote = await c.vendor_rfq_rel.findAll({
        vendor_id: id,
    })

    return new Response(200, {
        error: false,
        quote
    })
}
