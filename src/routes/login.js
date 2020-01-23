const router = require("express").Router()
const Account = require("../models/accounts")
const bcrypt = require("bcryptjs")
const {createToken, HTTPError} = require("../utils")

router.post("/login", async(req, res) => {
    const {email, password} = req.body

    const data = await Account.find({email})

    if(data === null) return res.status(400).send(HTTPError("The provided email does not belong to an account"))

    const valid = bcrypt.compareSync(password, data.password)

    if(!valid) return res.status(400).send(HTTPError("Password or email does not match an existing account"))

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