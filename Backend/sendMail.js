const nodemailer = require("nodemailer");
require("dotenv").config();

async function main(email, sub, tex) {
  const transporter = await nodemailer.createTransport({
    service: "gmail",

    auth: {
      user: "govind.007gr123@gmail.com",
      pass: process.env.EMAIL_PASS,
    },
  });
  const mailOptions = {
    from: "govind.007gr123@gmail.com",
    to: email,
    subject: sub,
    text: tex,
  };
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log("Invalid Email ID");
    } else {
      console.log("Email sent: ");
    }
  });
}

module.exports = main;
