const mongoose = require("mongoose");

const Product = require("../models/Product");
const Cart = require("../models/Cart");

/** Create a new product */
const createProduct = async (req, res) => {
  try {
    const { title, description, image, categories, size, color, price, stock } =
      req.body;

    if (
      !title ||
      !description ||
      !image ||
      !categories ||
      !size ||
      !color ||
      !price ||
      !stock
    )
      return res.status(400).json({ message: "Missing data" });

    const product = new Product({
      title: title,
      description: description,
      image: image,
      categories: categories.map((x) => x.toLowerCase()),
      size: size.map((x) => x.toLowerCase()),
      color: color.map((x) => ({
        color: x.color.toLowerCase(),
        code: x.code.toUpperCase(),
      })),
      price: price,
      stock: stock,
    });

    const savedProduct = await product.save();

    return res.status(200).json(savedProduct);
  } catch (err) {
    console.log("product.js controller, createProduct\n", err);
    return res
      .status(500)
      .json({ message: "Server error", error: err.message });
  }
};

/** Update a specific product */
const updateProduct = async (req, res) => {
  try {
    const { title, description, image, categories, size, color, price, stock } =
      req.body;

    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id))
      return res.status(400).json({ message: "Invalid Product Id" });

    if (
      !title ||
      !description ||
      !image ||
      !categories ||
      !size ||
      !color ||
      !price ||
      !stock
    )
      return res.status(400).json({ message: "Missing data" });

    const updatedProduct = await Product.findByIdAndUpdate(
      id,
      {
        title: title,
        description: description,
        image: image,
        categories: categories,
        size: size,
        color: color,
        price: price,
        stock: stock,
      },
      {
        new: true /** new is set to true for returning the update object */,
      }
    );

    return res.status(200).json(updatedProduct);
  } catch (error) {
    console.log("product.js controller, updateProduct function\n", error);
    return res
      .status(500)
      .json({ message: "Server Error", error: error.message });
  }
};

/** Delete a specific product */
const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id))
      return res.status(400).json({ message: "Invalid Product Id" });

    await Product.findByIdAndDelete(id);
    await Cart.updateMany({}, { $pull: { products: { productId: id } } });
    return res.status(200).json({ message: "Product deleted" });
  } catch (error) {
    console.log("product controller, deleteProduct\n", error);
    return res
      .status(500)
      .json({ message: "Server error", error: error.message });
  }
};

/** Get a specific product */
const getProduct = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id))
      return res.status(401).json({ message: "Invalid Product Id" });

    const product = await Product.findById(id);

    return res.status(200).json(product);
  } catch (error) {
    console.log("product controller, getProduct\n", error);
    return res
      .status(500)
      .json({ message: "Server error", error: error.message });
  }
};

/** Get list of produtcs */
const getAllProduct = async (req, res) => {
  try {
    const { limit, category, price, size } = req.query;

    let query = null,
      product = null;

    if (category && size)
      query = {
        $and: [
          { categories: { $in: [category.toLowerCase()] } },
          { size: { $in: [size.toLowerCase()] } },
        ],
      };
    else if (category)
      query = { categories: { $in: [category.toLowerCase()] } };
    else if (size) query = { size: { $in: [size.toLowerCase()] } };

    if (query) {
      if (limit > 0 && (price === "asc" || price === "desc"))
        product = await Product.find(query).sort({ price: price }).limit(limit);
      else if (price === "asc" || price === "desc")
        product = await Product.find(query).sort({ price: price });
      else if (limit > 0)
        product = await Product.find(query)
          .sort({ createdAt: -1 })
          .limit(limit);
      else product = await Product.find(query).sort({ createdAt: -1 });
    } else {
      if (limit > 0 && (price === "asc" || price === "desc"))
        product = await Product.find().sort({ price: price }).limit(limit);
      else if (price === "asc" || price === "desc")
        product = await Product.find().sort({ price: price });
      else if (limit > 0)
        product = await Product.find().sort({ createdAt: -1 }).limit(limit);
      else product = await Product.find().sort({ createdAt: -1 });
    }

    // if (limit > 0 && category)
    //   products = await Product.find({
    //     categories: { $in: [category.toLowerCase()] },
    //   })
    //     .sort({ createdAt: -1 })
    //     .limit(limit);
    // else if (limit > 0)
    //   products = await Product.find().sort({ createdAt: -1 }).limit(limit);
    // else if (category)
    //   products = await Product.find({
    //     categories: {
    //       $in: [category],
    //     },
    //   }).sort({ createdAt: -1 });
    // else products = await Product.find();

    return res.status(200).json(product);
  } catch (error) {
    console.log("user.js controller, getAllUser\n", error);
    return res.status(500).json({ message: "Server error" });
  }
};

module.exports = {
  createProduct,
  updateProduct,
  deleteProduct,
  getProduct,
  getAllProduct,
};
