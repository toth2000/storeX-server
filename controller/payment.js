const Razorpay = require("razorpay");
const dotenv = require("dotenv");
const CryptoJS = require("crypto-js");

const Order = require("../models/Order");
const { sendPaymentEmail } = require("../helper/email/email");

dotenv.config();

const key_id = process.env.razorpay_id;
const key_secret = process.env.razorpay_secret;
const razorpay_secret = process.env.razorpay_secret;

const razorpayInstance = new Razorpay({
  key_id: key_id,
  key_secret: key_secret,
});

/** Get specific payment detail using payment id */
const getPaymentDetail = async (req, res) => {
  try {
    const { paymentId } = req.params;
    const data = await razorpayInstance.payments.fetch(paymentId);
    return res.status(200).json(data);
  } catch (error) {
    console.log("payment controller, getPayment\n", error);
    return res
      .status(500)
      .json({ message: "Server Error", error: error.message });
  }
};

/** Verify payment and update order */
const verifyPayment = async (req, res) => {
  try {
    const { razorpayOrderId, razorpayPaymentId, razorpaySignature } = req.body;

    if (!razorpayOrderId || !razorpayPaymentId || !razorpaySignature)
      return res.status(401).json({ message: "Required data is not provided" });

    const generatedSignature = CryptoJS.HmacSHA256(
      razorpayOrderId + "|" + razorpayPaymentId,
      razorpay_secret
    ).toString();

    if (generatedSignature === razorpaySignature) {
      const order = await Order.findOneAndUpdate(
        { razorpayOrderId: razorpayOrderId },
        {
          razorpayOrderId: razorpayOrderId,
          razorpayPaymentId: razorpayPaymentId,
          razorpaySignature: razorpaySignature,
          paymentSuccess: true,
        },
        { new: true }
      );

      sendPaymentEmail(order, req.user);

      return res
        .status(200)
        .json({ message: "Payment Verified", order: order });
    }

    return res.status(401).json({ message: "Payment could not be verified" });
  } catch (error) {
    console.log("payment controller, verifyPayment\n", error);
    return res.status(500).json({ message: "Server error", error: error });
  }
};

module.exports = { razorpayInstance, getPaymentDetail, verifyPayment };
