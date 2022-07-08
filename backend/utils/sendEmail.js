const nodeMailer = require("nodemailer");

const sendEmail = async (options) => {
  console.log("hii");
  const transporter =await nodeMailer.createTransport({
    // host: "smtp.ethereal.email",
    // port: 587,
    // service: process.env.SMPT_SERVICE,
    secure:false,
    service: "gmail",
    auth: {
    //   user: process.env.SMPT_MAIL,
      user: "sainath414r@gmail.com",
      pass: "gnizavzvxachxsww",
    },
  });

  const mailOptions = {
    // from: process.env.SMPT_MAIL,
    from: "sainath414r@gmail.com",
    // to: options.email,
    to: "sainathreddy863@gmail.com",
    subject: options.subject,
    text: options.message,
  };

  console.log("sending");
  await transporter.sendMail(mailOptions);
};

module.exports = sendEmail;
