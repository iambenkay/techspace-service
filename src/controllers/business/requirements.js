const c = require("../../data/collections")
const { Response, ResponseError } = require("../../utils")

module.exports.get = async request => {
    const { id } = request.payload

    const business = await c.accounts.find({ _id: id })
    return new Response(200, {
        error: false,
        requirements: business.requirements || []
    })
}

module.exports.set = async request => {
    const { id } = request.payload
    const { requirement } = request.body

    if(!requirement) throw new ResponseError(400, "You must provide requirement")
    const business = await c.accounts.find({ _id: id })
    if (!business.requirements) business.requirements = []
    if (business.requirements.includes(requirement)) throw new ResponseError(400, "Requirement already exists")

    await c.accounts.update({ _id: id }, { requirements: [requirement, ...business.requirements] })

    return new Response(200, {
        error: false,
        message: "Requirement has been set"
    })
}

module.exports.remove = async request => {
    const { id } = request.payload
    const { requirement } = request.body

    if(!requirement) throw new ResponseError(400, "You must provide requirement")
    const business = await c.accounts.find({ _id: id })
    if (!business.requirements) throw new ResponseError(400, "There are no requirements to remove")
    if(!business.requirements.includes(requirement)) throw new ResponseError(400, "It is not a requirement")
    const i = business.requirements.indexOf(requirement)
    business.requirements.splice(i, 1)

    await c.accounts.update({ _id: id }, { requirements: business.requirements })

    return new Response(200, {
        error: false,
        message: "Requirement has been removed"
    })
}

module.exports.edit = async request => {
    const { id } = request.payload
    const { old_requirement, new_requirement } = request.body

    if(!old_requirement || !new_requirement) throw new ResponseError(400, "You must provide old_requirement and new_requirement")

    const business = await c.accounts.find({ _id: id })

    if (!business.requirements) throw new ResponseError(400, "There are no requirements to edit")

    const i = business.requirements.indexOf(old_requirement)
    business.requirements.splice(i, 1, new_requirement)

    await c.accounts.update({ _id: id }, { requirements: business.requirements })

    return new Response(200, {
        error: false,
        message: "Requirement has been updated"
    })
}
