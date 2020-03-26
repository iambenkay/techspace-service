const grpc = require("grpc");
const MailService = require("../src/rpcs/mailer");
const assert = require("assert");

const mail_service = new MailService.package(
  "localhost:60021",
  grpc.credentials.createInsecure()
);

mail_service.sendMail(
  {
    to: "benjamincath@gmail.com",
    text: "Test mail from Vodacom WQ",
    html: "Test mail from Vodacom WQ",
    subject: "TEST MAIL"
  },
  (error, _) => {
    console.log("Second");
    assert.equal(error, null, "Error is meant to be null");
  }
);
