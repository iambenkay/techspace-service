const Collection = require("../../data/orm")
const bcrypt = require("bcryptjs")
const { createToken, ResponseError, Response } = require("../../utils")

const Account = Collection("accounts")

module.exports = async request => {
    const { email, password } = request.body

    const data = await Account.find({ email })

    if (data === null) throw new ResponseError(400, "The provided email does not belong to an account")

    const valid = bcrypt.compareSync(password, data.password)

    if (!valid) throw new ResponseError(400, "Password or email does not match an existing account")
    Account.update({email}, { lastLogin: Date.now() })
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