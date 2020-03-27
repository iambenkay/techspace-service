const c = require("../../data/collections")
const { Response, ResponseError } = require("../../utils")
const Mail = require("../../services/mailer")
const m = require("../../models")

module.exports = async request => {
    const { id } = request.payload
    const { email } = request.body

    if (!email) throw new ResponseError(400, "You must provide the email of the vendor")
    const business_data = await c.accounts.find({ _id: id })
    const business = new m.Business(business_data)
    const invite_token = await business.invite_vendor(email)
    const vendor = await c.accounts.find({ email })

    const host = request.get('host')
    const scheme = process.env.STATE === 'development' ? 'http' : 'https'
    const email_ver_link = `${scheme}://${host}/vendor-invite?token=${invite_token}`
    if (process.env.STATE === 'development') console.log(email_ver_link)
    SendMail(
        [email],
        `Invitation to be a vendor at ${business.objects.name}!`,
        `You have been invited by ${business.objects.name} (${business.objects.email}) to be a vendor.` +
        `Click the link to accept the offer: ${email_ver_link}`,
        `<div>You have been invited by ${business.objects.name} (${business.objects.email}) to be a vendor.` +
        `Click the link to accept the offer: <a href="${email_ver_link}">${email_ver_link}</a></div>`)
    return new Response(200, {
        error: false,
        message: "Invitation has been sent to vendor"
    }, {
        content: {
            [id]: `You invited the vendor ${vendor.name} to your business`,
            [vendor.id]: `You were invited to the business run by ${business.objects.name}`,
        }, type: "accounts"
    })
}
