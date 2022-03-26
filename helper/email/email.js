const nodemailer = require("nodemailer");

const oderConfirmationEmailTemplate = require("../template/orderConfirmation/orderConfirmation");
const paymentSuccessTemplate = require('../template/paymentConfirmation/paymentConfirmation')

const O_AUTH_CLIENT_ID = process.env.O_AUTH_CLIENT_ID;
const O_AUTH_SECRET = process.env.O_AUTH_SECRET;
const EMAIL_REFRESH_TOKEN = process.env.EMAIL_REFRESH_TOKEN;

const transporter = nodemailer.createTransport({
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

const sendOrderConfirmationEmail = async (order, user) => {
  try {
    const template = await oderConfirmationEmailTemplate(order);

    const info = await transporter.sendMail({
      from: '"StoreX" <tothagatab@gmail.com>', // sender address
      replyTo: "mail@tothagata.me",
      to: user.email, // list of receivers
      subject: `Your Order #${order._id} has been placed`, // Subject line
      html: template, // html body
    });

  } catch (error) {
    console.log("Error in email.js controller, sendOrderEmail\n", error);
  }
};

const sendPaymentEmail = async (order, user) => {
  try {
    const template = paymentSuccessTemplate(order);

    const info = await transporter.sendMail({
      from: '"StoreX" <tothagatab@gmail.com>', // sender address
      replyTo: "mail@tothagata.me",
      to: user.email, // list of receivers
      subject: `Payment Confirmation of Order #${order._id}`, // Subject line
      html: template, // html body
    });

  } catch (error) {
    console.log("Error in email.js controller, sendPaymentEmail\n", error);
  }
};

module.exports = { sendOrderConfirmationEmail, sendPaymentEmail };
