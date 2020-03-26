const proto_loader = require("@grpc/proto-loader");
const grpc = require("grpc");
const logger = require("../services/logger");

const Mail = require("../services/mailer");

const mail_package_def = proto_loader.loadSync("src/protos/mail.proto");

const mail_package = grpc.loadPackageDefinition(mail_package_def).MailService;

module.exports.package = mail_package;

module.exports.impl = {
  sendMail({request: mail}, callback) {
    try {
      new Mail([mail.to], mail.subject, mail.text, mail.html).send();
    } catch (error) {
      logger(error);
    }
    callback(null, {});
  }
};
