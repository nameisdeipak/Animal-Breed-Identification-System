const nodemailer = require("nodemailer");

const sendEmail = async (options) => {
    //   console.log("buggg 7")
  const transporter = nodemailer.createTransport({
    service: "Gmail", 
    auth: {
      user: process.env.EMAIL_USER, 
      pass: process.env.EMAIL_PASS,
    },
  });
//   console.log("buggg 8")
  const mailOptions = {
    from: `DairyPro Support <${process.env.EMAIL_USER}>`,
    to: options.email,
    subject: options.subject,
    text: options.message,
    html: `<b>${options.message}</b>`,
  };
//   console.log("buggg 9")
  await transporter.sendMail(mailOptions);

    // console.log("buggg 10")
};

module.exports = sendEmail;