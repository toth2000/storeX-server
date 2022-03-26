const mongoose = require("mongoose");

const Order = require("../models/Order");
const Product = require("../models/Product");
const { razorpayInstance } = require("./payment");
const { sendOrderConfirmationEmail } = require("../helper/email/email");

/** Create a new order */
const createOrder = async (req, res) => {
  try {
    const { products, address, phone } = req.body;

    if (!products || !address || !phone)
      return res.status(400).json({ message: "Missing data" });

    let amount = 0;

    const productList = [];
    await Promise.all(
      products.map(async (item) => {
        const product = await Product.findById(item.productId);
        amount += item.quantity * product.price;
        productList.push({ ...item, amount: product.price });
      })
    );

    //Shipping Cost
    if (amount < 500) amount += 1;

    const order = new Order({
      userId: req.userId,
      products: productList,
      amount: amount.toFixed(2),
      address: address,
      phone: phone,
      shippingCost: amount < 500 ? 1 : 0,
      taxPercentage: 18,
    });

    const razorpayOrder = {
      amount: order.amount * 100,
      currency: "INR",
      receipt: order._id,
    };

    await razorpayInstance.orders.create(razorpayOrder, (err, ord) => {
      if (err) {
        console.log("order controller, create new razorpay order\n", err);
        return res
          .status(401)
          .json({ message: "Error creating order", error: err });
      }

      order.razorpayOrderId = ord.id;
    });

    const savedOrder = await order.save();
    sendOrderConfirmationEmail(savedOrder, req.user);

    return res.status(200).json(savedOrder);
  } catch (err) {
    console.log("order.js controller, createOrder\n", err);
    return res
      .status(500)
      .json({ message: "Server error", error: err.message });
  }
};

/** Update a specific order */
const updateOrder = async (req, res) => {
  try {
    const { address, phone, status } = req.body;

    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id))
      return res.status(400).json({ message: "Invalid Cart Id" });

    if (address || phone || status)
      return res.status(400).json({ message: "Missing data" });

    const updatedOrder = await Order.findByIdAndUpdate(
      id,
      {
        address: address,
        phone: phone,
        status: status,
      },
      {
        new: true /** new is set to true for returning the update object */,
      }
    );

    return res.status(200).json(updatedOrder);
  } catch (error) {
    console.log("order.js controller, updateOrder function\n", error);
    return res
      .status(500)
      .json({ message: "Server Error", error: error.message });
  }
};

/** Delete a specific order */
const deleteOrder = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id))
      return res.status(400).json({ message: "Invalid Order Id" });

    await Order.findByIdAndDelete(id);
    return res.status(200).json({ message: "Order deleted" });
  } catch (error) {
    console.log("order controller, deleteOrder\n", error);
    return res
      .status(500)
      .json({ message: "Server error", error: error.message });
  }
};

/** Get all orders of current */
const getOrder = async (req, res) => {
  try {
    const { limit } = req.query;

    const orders =
      limit > 0
        ? await Order.find({ userId: req.userId })
            .sort({ createdAt: -1 })
            .limit(limit)
        : await Order.find({ userId: req.userId }).sort({ createdAt: -1 });

    return res.status(200).json(orders);
  } catch (error) {
    console.log("order.js controller, getorder\n", error);
    return res
      .status(500)
      .json({ message: "Server error", error: error.message });
  }
};

/** Get a specific order of current user */
const getCurrentUserSpecificOrder = (req, res) => {
  const order = req.order;
  return res.status(200).json(order);
};

/** Get a specific user orders (Only for Admin) */
const getUserOrder = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id))
      return res.status(401).json({ message: "Invalid User Id" });

    const orders = await Order.find({ userId: id });

    return res.status(200).json(orders);
  } catch (error) {
    console.log("order controller, getOrder\n", error);
    return res
      .status(500)
      .json({ message: "Server error", error: error.message });
  }
};

/** Get all orders (Only for admin) */
const getAllOrder = async (req, res) => {
  try {
    const { limit } = req.query;

    const orders =
      limit > 0
        ? await Order.find().sort({ createdAt: -1 }).limit(limit)
        : await Order.find();

    return res.status(200).json(orders);
  } catch (error) {
    console.log("order.js controller, getAllOrder\n", error);
    return res.status(500).json({ message: "Server error" });
  }
};

/**Get daily income of previous month */
const getOrderStats = async (req, res) => {
  try {
    const date = new Date(); /**Current Date */
    const lastMonth = new Date(
      date.setMonth(date.getMonth() - 2)
    ); /** Previous 2 month date */

    const data = await Order.aggregate([
      { $match: { createdAt: { $gte: lastMonth } } },
      {
        $project: {
          month: { $month: "$createdAt" },
          sales: "$amount",
        },
      },
      {
        $group: {
          _id: "$month",
          total: { $sum: "$sales" },
        },
      },
    ]);

    return res.status(200).json(data);
  } catch (err) {
    console.log("order.js controller, getOrderStats\n", err);
    return res.status(500).json({ message: "Server error" });
  }
};

module.exports = {
  createOrder,
  updateOrder,
  deleteOrder,
  getOrder,
  getUserOrder,
  getCurrentUserSpecificOrder,
  getAllOrder,
  getOrderStats,
};
