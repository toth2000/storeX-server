const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
  {
    userId: { type: String, required: true },
    products: [
      {
        productId: { type: String, required: true },
        quantity: { type: Number, required: true, default: 1 },
        size: { type: String, required: true },
        color: {
          color: { type: String, required: true },
          code: { type: String, required: true },
        },
        amount: { type: Number, required: true },
      },
    ],
    amount: { type: Number, required: true },
    taxPercentage: { type: Number, required: true },
    shippingCost: { type: Number, required: true },
    address: {
      firstName: { type: String, required: true },
      lastName: { type: String, required: true },
      phoneNumber: { type: String, required: true },
      address1: { type: String, required: true },
      address2: { type: String },
      address3: { type: String },
      landmark: { type: String },
      locality: { type: String },
      city: { type: String, required: true },
      pincode: { type: String, required: true },
      state: { type: String, required: true },
    },
    phone: { type: String, required: true },
    status: { type: String, default: "pending" },

    paymentSuccess: { type: Boolean, default: false },
    razorpayOrderId: { type: String, default: "" },
    razorpayPaymentId: { type: String, default: "" },
    razorpaySignature: { type: String, default: "" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Order", orderSchema);
