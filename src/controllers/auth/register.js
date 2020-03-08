const Collection = require("../../data/orm")
const bcrypt = require("bcryptjs")
const { ResponseError, Response } = require("../../utils")
const tokeniser = require("../../services/tokeniser")
const V = require("../../services/validator")
const Mail = require("../../services/mailer")

const Account = Collection("accounts")

module.exports = async request => {
    const { name, email, userType, password, phone } = request.body

    V.allExist("You need to provide name, email, userType, password, phone", email, name, userType, password, phone)
        .matchesRegex("userType must be one of business, regular, vendor", userType, /^(business|regular|vendor)$/)
        .matchesRegex("phone must be of the form +234 --- --- ----", phone, /^\+234\ ?\d{3}\ ?\d{3}\ ?\d{4}$/)
        .isEmail("email is not valid", email);
    const hashedPassword = bcrypt.hashSync(password)

    const emailExists = await Account.find({ email }).then(user => !!user)
    if (emailExists) throw new ResponseError(400, "email is already in use")
    const phoneExists = await Account.find({ phone }).then(user => !!user)
    if (phoneExists) throw new ResponseError(400, "phone is already in use")

    let data = {}
    if (userType === 'vendor') {
        const { service_category, service_location } = request.body
        V.allExist("You must provide service_category and service_location for a vendor account before registering", service_category, service_location)
        data = await Account.insert({
            email,
            name,
            userType,
            password: hashedPassword,
            phone,
            isVerified: false,
            service_category, service_location
        })
    } else {
        data = await Account.insert({
            email,
            name,
            userType,
            password: hashedPassword,
            phone,
            isVerified: false,
        })
    }

    const token = tokeniser.create({
        email: data.email,
        phone: data.phone,
        userType: data.userType,
        id: data.id
    })
    delete data.password
    new Mail('"Vendor Alliance" <support@vodacomgroup.com>',
        ["benjamincath@gmail.com"], "Account created successfully",
        "Your account was created successfully",
        "<b>Your Account was created successfully</b>").send()
    return new Response(201, {
        error: false,
        ...data,
        token
    })
}