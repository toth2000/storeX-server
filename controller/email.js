const nodemailer = require("nodemailer");

const O_AUTH_CLIENT_ID = process.env.O_AUTH_CLIENT_ID;
const O_AUTH_SECRET = process.env.O_AUTH_SECRET;
const EMAIL_REFRESH_TOKEN = process.env.EMAIL_REFRESH_TOKEN;

const sendEmail = async (req, res) => {
  try {
    // create reusable transporter object using the default SMTP transport
    let transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        type: "OAuth2",
        user: "tothagatab@gmail.com",
        pass: "ironman262208",
        clientId: O_AUTH_CLIENT_ID,
        clientSecret: O_AUTH_SECRET,
        refreshToken: EMAIL_REFRESH_TOKEN,
      },
    });

    // send mail with defined transport object
    let info = await transporter.sendMail({
      from: '"StoreX" <tothagatab@gmail.com>', // sender address
      to: "tothagata.bhattacharjee@gmail.com", // list of receivers
      subject: "Order Confirmation ", // Subject line
      text: "Hello world?", // plain text body
      html: "<b>Hello world?</b>", // html body
    });

    console.log("Message sent: %s", info.messageId);
    // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>

    // Preview only available when sending through an Ethereal account
    console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
    // Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...

    return res.status(200).json({ message: "Message Sent Successfully" });
  } catch (error) {
    console.log("Error in email.js controller, sendEmail\n", error);
    return res.status(500).json({ message: "Server Error" });
  }
};

module.exports = { sendEmail };
