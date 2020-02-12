const Collection = require("../../data/orm")
const bcrypt = require("bcryptjs")
const { createToken, ResponseError, Response } = require("../../utils")

const Account = Collection("accounts")

module.exports = async request => {
    const { name, email, userType, password, phone } = request.body

    if (!email || !name || !userType || !password || !phone) {
        throw new ResponseError(400, "You need to provide name, email, userType, password, phone")
    }
    if (!(/^(business|regular|vendor)$/.test(userType))) {
        throw new ResponseError(400, "userType must be one of business, regular, vendor")
    }
    if (!(/\+234\ ?\d{3}\ ?\d{3}\ ?\d{4}/.test(phone))) {
        throw new ResponseError(400, "phone must be of the form +234 --- --- ----")
    }
    if (!(/(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/.test(email))) {
        throw new ResponseError(400, "email is not valid")
    }

    const hashedPassword = bcrypt.hashSync(password)

    const emailExists = await Account.find({ email }).then(user => !!user)
    if (emailExists) throw new ResponseError(400, "email is already in use")
    const phoneExists = await Account.find({ phone }).then(user => !!user)
    if (phoneExists) throw new ResponseError(400, "phone is already in use")

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

    return new Response(201, {
        error: false,
        ...data,
        token
    })
}