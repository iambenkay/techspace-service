const grpc = require("grpc");
const MailService = require("../src/rpcs/mailer");

const mail_service = new MailService.package(
  "localhost:60021",
  grpc.credentials.createInsecure()
);

module.exports = mail_service
