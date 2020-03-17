const nodemailer = require("nodemailer")
const { EMAIL_HOST, EMAIL_USER, EMAIL_PASSWORD, EMAIL_PORT, EMAIL_USE_TLS } = process.env

class Mail {
    /**
     * 
     * @param {String} from 
     * @param {String[]} to 
     * @param {String} subject 
     * @param {String} text 
     * @param {String} html 
     */
    constructor(from, to, subject, text, html) {
        this.from = from
        this.to = to.join(", ")
        this.subject = subject
        this.text = text
        this.html = html
    }
    send() {
        try {

            let transporter = nodemailer.createTransport({
                host: EMAIL_HOST,
                port: EMAIL_PORT,
                secure: EMAIL_USE_TLS == 0 ? false: true,
                auth: {
                    user: EMAIL_USER,
                    pass: EMAIL_PASSWORD
                }
            })
            transporter.sendMail({
                from: this.from, to: this.to, subject: this.subject, text: this.text, html: this.html
            })
        } catch (e) {
            console.error(e.message)
        }
    }
}

module.exports = Mail
