const router = require("express").Router()
const Collection = require("../models/orm")
const bcrypt = require("bcryptjs")
const { createToken, HTTPError, removeDuplicates } = require("../utils")
const { isAuthenticated, isAccountType } = require("../middleware")
const allReqs = ["nin", "nationalid", "driverslicense", "certofownership", "tin", "intlpassport"]
const upload = require("multer")()

const Account = Collection("accounts")

// Get Account details
router.get("/accounts", isAuthenticated, async (req, res) => {
    const { id } = req.payload

    const user = await Account.find({ _id: id })

    delete user.password

    return res.status(200).send(user)
})

// Delist a vendor from a business
router.delete("/accounts/vendors", isAuthenticated, isAccountType("business"), async (req, res) => {
    const { id } = req.payload

    const { email: vendorEmail } = req.body
    if (!vendorEmail) return res.status(400).send(HTTPError("Vendor email was not provided"))
    const vendor = { businesses =[], id: vendorId } = await Account.find({ email: vendorEmail })
    if (!vendor) return res.status(400).send(HTTPError("You can't remove a non-existent vendor account"))
    const isAVendorOf = businesses && businesses.includes(id)
    if (!isAVendorOf) return res.status(400).send(HTTPError("Vendor is not a part of your business"))
    const index = businesses.indexOf(id)
    delete businesses[index]
    await Account.update({ _id: vendorId }, { businesses })
    const { vendors = {} } = await Account.find({ _id: id })
    delete vendors[vendorId]
    await Account.update({ _id: id }, { vendors })
    return res.status(200).send({
        error: false,
        message: "You have delisted this vendor"
    })
})

// For vendors to apply business
router.post("/accounts/apply-to-business", isAuthenticated, isAccountType("vendor"), async (req, res) => {
    const { id } = req.payload
    const { email } = req.body

    if (!email) return res.status(400).send(HTTPError("You must provide id of the business you're trying to apply to"))

    const { vendorRequirements: v = "", id: businessId, vendors = {} } = await Account.find({ email })
    const vendorRequirements = v.split("|")
    let satisified = true
    for (let r of vendorRequirements) {
        if (!r) break
        const hasDoc = await Collection(r).find({ owner: id }).then(user => !!user)
        if (!hasDoc) {
            satisified = false
            break
        }
    }

    if (!satisified) return res.status(400).send(HTTPError(`You are not qualified to apply to this business. Upload the following: ${vendorRequirements.join(", ")}`))
    const { businesses = [] } = await Account.find({ _id: id })
    await Account.update({ _id: id }, { businesses: [businessId, ...businesses] })
    await Account.update({ email }, { vendors: { [id]: true, ...vendors } })
    return res.status(200).send({
        error: false,
        message: "Vendor added to business"
    })
})

// For businesses to invite vendors
router.post("/accounts/invite-vendor", isAuthenticated, isAccountType("business"), async (req, res) => {
    const { id } = req.payload
    const { email } = req.body

    if (!email) return res.status(400).send(HTTPError("You must provide the email of the vendor"))
    const { vendorRequirements: v = "", id: businessId, vendors = {} } = await Account.find({ _id: id })
    const { id: vendorId } = await Account.find({ email })
    const vendorRequirements = v.split("|")
    let satisfied = true
    for (let r of vendorRequirements) {
        if (!r) break
        const hasDoc = await Collection(r).find({ owner: vendorId }).then(user => !!user)
        if (!hasDoc) {
            satisfied = false
            break;
        }
    }
    const { businesses = [] } = await Account.find({ _id: vendorId })
    await Account.update({ _id: vendorId }, { businesses: [businessId, ...businesses] })
    await Account.update({ _id: id }, { vendors: { [id]: satisfied, ...vendors } })
    return res.status(200).send({
        error: false,
        message: "Vendor added to business"
    })
})

// For vendors to upload their certificates
router.post("/accounts/doc-upload", isAuthenticated, isAccountType("vendor"), upload.single("document"), async (req, res) => {
    const { id } = req.payload
    const { type } = req.body
    const { file: document } = req
    const isVendor = Account.find({ _id: id }).then(user => user && user.userType === 'vendor')
    if (!isVendor) return res.status(400).send(HTTPError("Account must be a vendor to upload identity documents"))
    const allowedMime = 'application/pdf'
    const maxSize = 6291456
    if (document.mimetype !== allowedMime) return res.status(400).send(HTTPError("You must upload a PDF file"))
    if (document.size > maxSize) return res.status(400).send(HTTPError("You must upload a file of less than 6MB"))
    const Identity = Collection(type)

    if (!document || !type) return res.status(400).send(HTTPError("You have to provide a document and type"))
    if (!allReqs.includes(type)) return res.status(400).send(HTTPError("Invalid document type"))
    const updateInstead = await Identity.find({ owner: id }).then(user => !!user)
    if (updateInstead) {
        await Identity.update({ owner: id, document, verified: false })
    } else await Identity.insert({ owner: id, document, verified: false })

    return res.status(200).send({
        error: false,
        message: "Document has been uploaded to database"
    })
})

// Search through the list of businesses
router.get("/accounts/business-search", isAuthenticated, async (req, res) => {
    const { q: searchQuery, by = "name" } = req.query
    if (!searchQuery) return res.status(400).send(HTTPError("You must send a query"))

    const businesses = await (await Account.findAll({ [by]: new RegExp(searchQuery, "i"), userType: "business" })).map(({ id, name = "", email }) => ({ id, name, email }))

    return res.status(200).send({
        error: false,
        businesses
    })
})

router.get("/accounts/user-search", isAuthenticated, async (req, res) => {
    const { q: searchQuery, by = "name" } = req.query
    if (!searchQuery) return res.status(400).send(HTTPError("You must send a query"))

    const businesses = await (await Account.findAll({ [by]: new RegExp(searchQuery, "i"), userType: "regular" })).map(({ id, name = "", email }) => ({ id, name, email }))

    return res.status(200).send({
        error: false,
        businesses
    })
})

router.get("/accounts/vendor-search", isAuthenticated, async (req, res) => {
    const { q: searchQuery, by = "name" } = req.query
    if (!searchQuery) return res.status(400).send(HTTPError("You must send a query"))

    const vendors = await (await Account.findAll({ [by]: new RegExp(searchQuery, "i"), userType: "vendor" })).map(({ id, name = "", email }) => ({ id, name, email }))

    return res.status(200).send({
        error: false,
        vendors
    })
})

// For businesses to post what they require of vendors
router.post("/accounts/vendor-requirements", isAuthenticated, isAccountType("business"), async (req, res) => {
    const { id, userType } = req.payload
    let { requirements } = req.body

    if (userType !== 'business') return res.status(400).send(HTTPError("You must be a business to add vendor requirements"))
    if (!requirements) return res.status(400).send(HTTPError("You must provide requirements"))

    const reqs = requirements.split("|")
    for (let req of reqs) {
        if (!allReqs.includes(req)) return res.status(400).send(HTTPError(`Invalid requirement: ${req} must be one of ${allReqs.join(", ")}`))
    }
    vendorReqs = removeDuplicates(reqs)
    await Account.update({ _id: id }, { vendorRequirements: vendorReqs.join("|") })
    return res.status(200).send({
        error: false,
        message: "Requirements have been updated"
    })
})

// For businesses to remove admins
router.delete("/accounts/admins", isAuthenticated, isAccountType("business"), async (req, res) => {
    const { id } = req.payload

    const {email} = req.body
    if(!email) return res.status(400).send(HTTPError("You need to provide an email of the admin you're trying to remove"))
    const admin = {_id: adminId, businessId} = await Account.find({email})
    if(!admin) return res.status(400).send(HTTPError("Account does not exist"))
    if(businessId !== id) return res.status(400).send(HTTPError("This is not an admin of this business"))
    const {admins} = await Account.find({_id: id})
    const index = admins.indexOf(vendorId)
    delete admins[index]
    await Account.update({_id: id}, {admins})
    await Account.update({_id: adminId}, {businessId: null})
})

// for businesses to add admins
router.post("/accounts/admins", isAuthenticated, isAccountType("business"), async (req, res) => {
    const { id } = req.payload
    const { email } = req.body
    if (!email) return res.status(400).send(HTTPError("You must provide the email of the user you want to make admin"))
    const regularUser = await Account.find({ email })
    if (!regularUser || regularUser.userType !== "regular") return res.status(400).send(HTTPError("You must provide a registered regular user account"))
    const admins = await Account.find({ _id: id }).then(account => account.admins || [])
    if (regularUser.id === id) return res.status(400).send(HTTPError("You can't add your businesss account. It is a default admin"))
    if (admins.includes(regularUser.id)) return res.status(200).send({
        error: false,
        message: "Already an admin"
    })
    admins.push(regularUser.id)
    await Account.update({ _id: id }, { admins })
    await Account.update({ _id: regularUser.id }, { businessId: id })
    return res.status(200).send({
        error: false,
        message: "User was added to admins"
    })
})

router.get("/accounts/vendors", isAuthenticated, isAccountType("business"), async (req, res) => {
    const {id} = req.payload

    const vendors = await Account.find({_id: id}).then(async business => {
        return Object.keys(business.vendors || {}).map(async vendor => {
            return await Account.find({_id: vendor}).then(({name, email, id}) => {name, email, id})
        })
    })
    return res.status(200).send({
        error: false,
        vendors
    })
})

router.get("/accounts/admins", isAuthenticated, isAccountType("business"), async (req, res) => {
    const {id} = req.payload

    const admins = await Account.findAll({_id: id}).then(async business => {
        business.admins = business.admins ? business.admins : []
        return business.admins.map(async v => {
            return await Account.find({_id: v}).then(({name, email, id}) => {name, email, id})
        })
    })
    return res.status(200).send({
        error: false,
        admins
    })
})

// For creating one of business, vendor or regular accounts
router.post("/accounts", async (req, res) => {
    const { name, email, userType, password, phone } = req.body

    if (!email || !name || !userType || !password || !phone) {
        return res.status(400).send(HTTPError("You need to provide name, email, userType, password, phone"))
    }
    if (!(/^(business|regular|vendor)$/.test(userType))) {
        return res.status(400).send(HTTPError("userType must be one of business, regular, vendor"))
    }
    if (!(/\+234\ ?\d{3}\ ?\d{3}\ ?\d{4}/.test(phone))) {
        return res.status(400).send(HTTPError("phone must be of the form +234 --- --- ----"))
    }
    if (!(/(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/.test(email))) {
        return res.status(400).send(HTTPError("email is not valid"))
    }

    const hashedPassword = bcrypt.hashSync(password)

    const emailExists = await Account.find({ email }).then(user => !!user)
    if (emailExists) return res.status(400).send(HTTPError("email is already in use"))
    const phoneExists = await Account.find({ phone }).then(user => !!user)
    if (phoneExists) return res.status(400).send(HTTPError("phone is already in use"))

    const data = await Account.insert({
        email,
        name,
        userType,
        password: hashedPassword,
        phone,
        isVerified: false,
    })
    const token = createToken({
        email: data.email,
        phone: data.phone,
        userType: data.userType,
        id: data.id
    })
    delete data.password
    return res.status(201).send({
        error: false,
        ...data,
        token
    })
})

module.exports = router