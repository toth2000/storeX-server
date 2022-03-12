const mongoose = require("mongoose");

const Order = require("../models/Order");

const verifyOderRequest = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id))
      return res.status(406).json({ message: "Invalid id" });

    const order = await Order.findById(id);

    if (!order)
      return res.status(404).json({ message: "Order does not exists" });

    if (order.userId !== req.userId)
      return res
        .status(401)
        .json({ message: "You are not allowed to access this order" });

    req.order = order;

    next();
  } catch (error) {
    console.log("Order MiddleWare, verifyOderRequest: ", error);
    return res.status(500).json({ message: "Server error" });
  }
};

module.exports = { verifyOderRequest };
