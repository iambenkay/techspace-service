const Collection = require("../../data/orm")
const { Response, ResponseError } = require("../../utils")

const Account = Collection("accounts")

module.exports = async request => {
    const { id } = request.payload
    const { type } = request.body
    const { file: document } = request
    const isVendor = await Account.find({ _id: id }).then(user => user && user.userType === 'vendor')
    if (!isVendor) throw new ResponseError(400, "Account must be a vendor to upload identity documents")
    const allowedMime = 'application/pdf'
    const maxSize = 6291456
    if (document.mimetype !== allowedMime) throw new ResponseError(400, "You must upload a PDF file")
    if (document.size > maxSize) throw new ResponseError(400, "You must upload a file of less than 6MB")
    const Identity = Collection(type)

    if (!document || !type) throw new ResponseError(400, "You have to provide a document and type")
    if (!allReqs.includes(type)) throw new ResponseError(400, "Invalid document type")
    const updateInstead = await Identity.find({ owner: id }).then(user => !!user)
    if (updateInstead) {
        await Identity.update({ owner: id, document, verified: false })
    } else await Identity.insert({ owner: id, document, verified: false })

    return new Response(200, {
        error: false,
        message: "Document has been uploaded to database"
    })
}