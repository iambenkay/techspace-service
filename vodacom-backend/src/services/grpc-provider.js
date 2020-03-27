const grpc = require("grpc");
const MailService = require("../src/rpcs/mailer");
const assert = require("assert");

const mail_service = new MailService.package(
  "localhost:60021",
  grpc.credentials.createInsecure()
);

module.exports
