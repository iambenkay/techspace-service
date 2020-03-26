const c = require("../data/collections")
const tokeniser = require("../services/tokeniser")

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
    const user = await c.accounts.find({ _id: req.payload.id })
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

function isAccountType(...type) {
    return async (req, res, next) => {
        const { userType } = req.payload
        if (!type.includes(userType)) return res.status(401).send({
            error: true,
            message: `You need to have account type ${type} to access this route`,
        })
        return next()
    }
}

module.exports = Object.freeze({
    isAuthenticated,
    isAccountType,
    mustHaveRequirement
})

async function mustHaveRequirement(req, res, next){
    const {id} = req.payload

    const business = await c.accounts.find({_id: id})

    if(!business.requirements) return res.status(400).send({
        error: true,
        message: "You must have set one business requirement"
    })
    const noDocumentReq = !Object.keys(business.requirements.document || {}).length
    const noStatutoryReq = !Object.keys(business.requirements.statutory | {}).length
    if(noDocumentReq && noStatutoryReq) return res.status(400).send({
        error: true,
        message: "You must set at least one business requirements"
    })

    return next();
}
