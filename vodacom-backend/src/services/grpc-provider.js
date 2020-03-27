const grpc = require("grpc");
const MailService = require("../../../vodacom-wq/src/rpcs/mailer");

const mail_service = new MailService.package(
  process.env.VODACOM_WORKER,
  grpc.credentials.createInsecure()
);

module.exports = mail_service;
