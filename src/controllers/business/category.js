const Collection = require("../../data/orm")
const { Response, ResponseError } = require("../../utils")
const Account = Collection("accounts")
const Business_Vendor_Rel = Collection("business-vendor-rel")
const V = require("../../services/validator")

module.exports.add = async request => {
    const { id } = request.payload
    let { category } = request.body

    if (!category) throw new ResponseError(400, "You must provide the category you want to add")
    const { categories = [] } = await Account.find({ _id: id })
    if(categories.includes(category)) throw new ResponseError(400, "Category already exists")
    if(!categories.includes(category)) await Account.update({ _id: id }, { categories: [category, ...categories] })
    return new Response(200, {
        error: false,
        message: "New category has been added"
    })
}

module.exports.getCategories = async request => {
    const {id} = request.payload

    let {categories = []} = await Account.find({_id: id})

    return new Response(200, {
        error: false,
        categories
    })
}

module.exports.remove = async request => {
    const { id } = request.payload
    let { category } = request.body

    if (!category) throw new ResponseError(400, "You must provide the category you want to remove")
    const { categories } = await Account.find({ _id: id })
    let index = categories.indexOf(category)
    delete categories[index]
    await Account.update({ _id: id }, { categories: [categories] })
    Business_Vendor_Rel.update({ businessId: id }, { businessCategory: null })
    return new Response(200, {
        error: false,
        message: "Category has been removed"
    })
}

module.exports.addVendor = async request => {
    const { id } = request.payload
    let { category, email } = request.body

    V.allExist("You must provide category and email", category, email)
    const vendor = await Account.find({email})
    V.allExist("You must add an existing vendor account", vendor)
    const {categories = []} = await Account.find({_id: id})
    V.expr(`'${category}' is not a valid category`, categories.includes(category))
    const bvr = await Business_Vendor_Rel.update({businessId: id, vendorId: vendor.id}, {business_category: category})
    V.allExist("The vendor is not a part of your business yet", bvr)

    return new Response(200, {
        error: false,
        message: `You have added the vendor ${email} to the category ${category}`
    })

}
