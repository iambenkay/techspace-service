const Collection = require("../../data/orm")
const bcrypt = require("bcryptjs")
const { ResponseError, Response } = require("../../utils")
const tokeniser = require("../../services/tokeniser")

const Account = Collection("accounts")

module.exports = async request => {
    const { email, password } = request.body
    request.V.allExist("You must provide email and password", email, password)
    const data = await Account.find({ email, registration_completed: true })

    if (data === null) throw new ResponseError(400, "The provided email does not belong to an account")

    const valid = bcrypt.compareSync(password, data.password)

    if (!valid) throw new ResponseError(400, "Password or email does not match an existing account")
    if (!data.isVerified) throw new ResponseError(400, "You have not verified your email address")
    Account.update({ email }, { lastLogin: Date.now() })
    const token = tokeniser.create({
        email: data.email,
        phone: data.phone,
        userType: data.userType,
        id: data.id,
        isVerified: data.isVerified
    })
    delete data.password
    return new Response(201, {
        error: false,
        ...data,
        token
    })
}
