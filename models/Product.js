const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    image: { type: String, required: true },
    categories: { type: [String], default: [] },
    size: { type: [String], default: [] },
    color: [
      {
        color: { type: String, required: true },
        code: { type: String, required: true },
      },
    ],
    price: { type: Number, required: true },
    stock: { type: Number, required: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Product", productSchema);
