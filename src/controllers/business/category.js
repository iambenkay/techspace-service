const c = require("../../data/collections")
const { Response, ResponseError } = require("../../utils")
const V = require("../../services/validator")

module.exports.add = async request => {
    const { id } = request.payload
    let { category } = request.body

    if (!category) throw new ResponseError(400, "You must provide the category you want to add")
    const { categories = [] } = await c.accounts.find({ _id: id })
    if (categories.includes(category)) throw new ResponseError(400, "Category already exists")
    if (!categories.includes(category)) await c.accounts.update({ _id: id }, { categories: [category, ...categories] })
    return new Response(200, {
        error: false,
        message: "New category has been added"
    })
}

module.exports.getCategories = async request => {
    const { id } = request.payload

    let { categories = [] } = await c.accounts.find({ _id: id })

    return new Response(200, {
        error: false,
        categories
    })
}

module.exports.remove = async request => {
    const { id } = request.payload
    let { category } = request.body

    if (!category) throw new ResponseError(400, "You must provide the category you want to remove")
    const { categories } = await c.accounts.find({ _id: id })
    let index = categories.indexOf(category)
    categories.splice(i, 1)
    await c.accounts.update({ _id: id }, { categories: [...categories] })
    c.business_vendor_rel.update({ businessId: id }, { businessCategory: null })
    return new Response(200, {
        error: false,
        message: "Category has been removed"
    })
}

module.exports.addVendor = async request => {
    const { id } = request.payload
    let { category, email } = request.body

    V.allExist("You must provide category and email", category, email)
    const vendor = await c.accounts.find({ email })
    V.allExist("You must add an existing vendor account", vendor)
    const { categories = [] } = await c.accounts.find({ _id: id })
    V.expr(`'${category}' is not a valid category`, categories.includes(category))
    const bvr = await c.business_vendor_rel.update({ businessId: id, vendorId: vendor.id }, { business_category: category })
    V.allExist("The vendor is not a part of your business yet", bvr)

    return new Response(200, {
        error: false,
        message: `You have added the vendor ${email} to the category ${category}`
    })
}

module.exports.removeVendor = async request => {
    const { id } = request.payload

    let { category, email } = request.body

    V.allExist("You must provide category and email", category, email)

    const vendor = await c.accounts.find({email})
    V.allExist("You must use an existing vendor account", vendor)

    const {categories = []} = await c.accounts.find({_id: id})
    V.expr(`'${category}' is not a valid category`, categories.includes(category))

    const bvr = await c.business_vendor_rel.update({businessId: id, vendorId: vendor.id}, {business_category: null})
    V.allExist("The vendor is not a part of your business yet", bvr)

    return new Response(200, {
        error: false,
        message: `You have removed the vendor ${email} from the category ${category}`
    })
}
