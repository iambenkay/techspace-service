const router = require("express").Router()
const Account = require("../models/accounts")
const bcrypt = require("bcryptjs")
const { createToken, httperror, isAuthenticated, removeDuplicates } = require("../utils")

router.get("/accounts", isAuthenticated, async (req, res) => {
    const { id } = req.payload

    const user = await Account.find({ _id: id })

    delete user.password

    return res.status(200).send(user)
})


router.post("/accounts/vendors", isAuthenticated, (req, res) => {
    const { businessId } = req.body
    const { id } = req.payload
})

router.post("/accounts/doc-upload", isAuthenticated, (req, res) => {
    const { id } = req.payload
    const { document } = req.body

    if (!document) return res.status(400).send(httperror("You have to provide a document"))
})

router.post("/accounts/vendor-requirements", isAuthenticated, async (req, res) => {
    const { id, userType } = req.payload
    let { requirements } = req.body

    if (userType !== 'business') return res.status(400).send(httperror("You must be a business to add vendor requirements"))
    if (!requirements) return res.status(400).send(httperror("You must provide requirements"))
    const allReqs = ["nin", "nationalid", "driverslicense", "certofownership", "tin", "intlpassport"]

    const reqs = requirements.split("|")
    for (let req of reqs) {
        if (!allReqs.includes(req)) return res.status(400).send(httperror(`Invalid requirement: ${req} must be one of ${allReqs.join(", ")}`))
    }
    vendorReqs = removeDuplicates(reqs)
    await Account.update({ _id: id }, { vendorRequirements: vendorReqs.join("|") })
    return res.status(200).send({
        error: false,
        message: "Requirements have been updated"
    })
})

router.post("/accounts/admins", isAuthenticated, async (req, res) => {
    const { id, userType } = req.payload
    if (userType !== "business") return res.status(400).send(httperror("You must be a business to have admins"))
    const { email } = req.body
    if (!email) return res.status(400).send(httperror("You must provide the email of the user you want to make admin"))
    const regularUser = await Account.find({ email })
    if (regularUser.userType !== "regular") res.status(400).send(httperror("You must provide a registered regular user account"))
    const admins = await Account.find({ _id: id }).then(account => account.admins || [])
    if (regularUser.id === id) return res.status(400).send(httperror("You can't add your businesss account. It is a default admin"))
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

router.post("/accounts", async (req, res) => {
    const { email, userType, password, phone } = req.body

    if (!email || !userType || !password || !phone) {
        return res.status(400).send(httperror("You need to provide email, userType, password, phone"))
    }
    if (!(/^(business|regular|vendor)$/.test(userType))) {
        return res.status(400).send(httperror("userType must be one of business, regular, vendor"))
    }
    if (!(/\+234\d{10}/.test(phone))) {
        return res.status(400).send(httperror("phone must be of the form +234----------"))
    }
    if (!(/(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/.test(email))) {
        return res.status(400).send(httperror("email is not valid"))
    }

    const hashedPassword = bcrypt.hashSync(password)

    const emailExists = await Account.find({ email }).then(user => !!user)
    if (emailExists) return res.status(400).send(httperror("email is already in use"))
    const phoneExists = await Account.find({ phone }).then(user => !!user)
    if (phoneExists) return res.status(400).send(httperror("phone is already in use"))

    const data = await Account.insert({
        email,
        userType,
        password: hashedPassword,
        phone
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