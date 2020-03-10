const Collection = require("../data/orm")
const tokeniser = require("../services/tokeniser")

const Account = Collection("accounts")

async function isAuthenticated(req, res, next) {
    if (!req.get("Authorization") || !req.get("Authorization").startsWith("Bearer "))
        return res.status(401).send({
            error: true,
            message: "You have to provide a JWT Token",
        })
    const token = req.get("Authorization").split(" ")[1]
    req.payload = tokeniser.decode(token)
    if (!req.payload) return res.status(401).send({
        error: true,
        message: "Invalid JWT Token",
    })
    const user = await Account.find({ _id: req.payload.id })
    if (!user) return res.status(401).send({
        error: true,
        message: "Invalid Account details",
    })
    if (!user.isVerified) return res.status(401).send({
        error: true,
        message: "This account has not yet been verified",
    })
    return next()
}

function isAccountType(type) {
    return async (req, res, next) => {
        const { userType } = req.payload
        if (userType !== type) return res.status(401).send({
            error: true,
            message: `You need to have account type ${type} to access this route`,
        })
        return next()
    }
}

module.exports = Object.freeze({
    isAuthenticated,
    isAccountType
})
