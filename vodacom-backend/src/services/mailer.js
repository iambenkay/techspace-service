const AWS = require("aws-sdk");
const SESConfig = require("../../../ses-config.json");

AWS.config.update(SESConfig);

const ses = new AWS.SES({ apiVersion: "2010-12-01" });

class Mail {
  /**
   *
   * @param {String[]} to
   * @param {String} subject
   * @param {String} text
   * @param {String} html
   */
  constructor(to, subject, text, html) {
    this.to = to;
    this.subject = subject;
    this.text = text;
    this.html = html;
  }
  async send() {
    try {
      await ses
        .sendEmail({
          Destination: {
            ToAddresses: this.to,
          },
          Message: {
            Body: {
              Html: {
                Charset: "UTF-8",
                Data: this.html,
              },
              Text: {
                Charset: "UTF-8",
                Data: this.text,
              },
            },
            Subject: {
              Charset: "UTF-8",
              Data: this.subject,
            },
          },
          Source: "techspace@convageo.com",
        })
        .promise();
    } catch (e) {
      console.error(e.message);
    }
  }
}

module.exports = (to, subject, text, html) => {
  new Mail(to, subject, text, html).send();
};
