const MailService = require("../services/grpc-provider");

module.exports = (to, subject, text, html) => {
  MailService.sendMail(
    {
      to,
      subject,
      html,
      text
    },
    (error, _) => {
      console.log("Mail sent");
    }
  );
};
