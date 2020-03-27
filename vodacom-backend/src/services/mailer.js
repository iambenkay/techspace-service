const MailService = require("../services/grpc-provider");

module.exports = ({ to, text, html, subject }) => {
  MailService.sendMail(
    {
      to,
      text,
      html,
      subject
    },
    (error, _) => {
        console.log("Mail sent");
    }
  );
};
