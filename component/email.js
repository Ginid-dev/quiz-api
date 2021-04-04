const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    user: process.env.EMAIL_USERNAME,
    pass: process.env.EMAIL_PASSWORD,
  },
});

exports.accountVerificationEmail = (to, token) => {
  let url = process.env.APP_URL + "/verify/" + token;
  let html =
    "<p>Grazie per esserti registrato con la mail " +
    to +
    ".</p><p>Dovrai solo confermare la tua registrazione cliccando <a href='" +
    url +
    "'>QUI</a></p>";
  let mailOptions = {
    from: process.env.EMAIL_USERNAME,
    to: to,
    subject: "Verifica il tuo indirizzo Email",
    html: html,
  };

  return transporter.sendMail(mailOptions);
};
