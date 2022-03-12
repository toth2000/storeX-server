const mongoose = require("mongoose");

const Cart = require("../models/Cart");
const Product = require("../models/Product");

/** Create a new cart */
const createCart = async (req, res) => {
  try {
    const { products } = req.body;

    if (!products) return res.status(400).json({ message: "Missing data" });

    const cart = new Cart({
      userId: req.userId,
      products: products,
    });

    const savedCart = await cart.save();

    return res.status(200).json(savedCart);
  } catch (err) {
    console.log("cart.js controller, createCart\n", err);
    return res
      .status(500)
      .json({ message: "Server error", error: err.message });
  }
};

/** Update a specific cart */
const updateCart = async (req, res) => {
  try {
    const { products } = req.body;

    if (!products) return res.status(400).json({ message: "Missing data" });

    const updatedCart = await Cart.findOneAndUpdate(
      { userId: req.userId },
      {
        products: products,
      },
      {
        new: true /** new is set to true for returning the update object */,
      }
    );

    return res.status(200).json(updatedCart);
  } catch (error) {
    console.log("cart.js controller, updateCart function\n", error);
    return res
      .status(500)
      .json({ message: "Server Error", error: error.message });
  }
};

/** Delete a specific cart */
const deleteCart = async (req, res) => {
  try {
    await Cart.findOneAndDelete({ userId: req.userId });
    return res.status(200).json({ message: "Cart deleted" });
  } catch (error) {
    console.log("cart controller, deleteCart\n", error);
    return res
      .status(500)
      .json({ message: "Server error", error: error.message });
  }
};

/** Get a current user cart */
const getCart = async (req, res) => {
  try {
    const cart = await Cart.findOne({ userId: req.userId });

    return res.status(200).json(cart);
  } catch (error) {
    console.log("cart controller, getCart\n", error);
    return res
      .status(500)
      .json({ message: "Server error", error: error.message });
  }
};

/** Get a specific user cart (Only for Admin) */
const getUserCart = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id))
      return res.status(401).json({ message: "Invalid User Id" });

    const cart = await Cart.findOne({ userId: id });

    return res.status(200).json(cart);
  } catch (error) {
    console.log("cart controller, getCart\n", error);
    return res
      .status(500)
      .json({ message: "Server error", error: error.message });
  }
};

/** Get all cart (Only for admin) */
const getAllCart = async (req, res) => {
  try {
    const { limit } = req.query;

    const cart =
      limit > 0
        ? await Cart.find().sort({ createdAt: -1 }).limit(limit)
        : await Cart.find();

    return res.status(200).json(cart);
  } catch (error) {
    console.log("cart.js controller, getAllCart\n", error);
    return res.status(500).json({ message: "Server error" });
  }
};

/** Get cart total of current user */
const getCartTotal = async (req, res) => {
  try {
    const { products } = req.body;

    if (!products)
      return res.status(404).json({ message: "User cart not found" });

    let total = 0;

    await Promise.all(
      products.map(async (item) => {
        const product = await Product.findById(item.productId);
        total += item.quantity * product.price;
      })
    );

    return res.status(200).json({
      total: total,
      tax: total * 0.18,
      subtotal: total * 0.82,
      shipping: total < 500 ? 40 : 0,
    });
  } catch (error) {
    console.log("cart.js controller, getCartTotal\n", error);
    return res.status(500).json({ message: "Server error" });
  }
};

module.exports = {
  createCart,
  updateCart,
  deleteCart,
  getCart,
  getUserCart,
  getAllCart,
  getCartTotal,
};
