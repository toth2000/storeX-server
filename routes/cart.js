const express = require("express");

const {
  verifyTokenAdminAuthorization,
  verifyTokenAuthorization,
} = require("../middleware/auth");

const {
  getUserCart,
  deleteCart,
  updateCart,
  createCart,
  getCart,
  getAllCart,
  getCartTotal,
} = require("../controller/cart");

const router = express.Router();

router.get("/", verifyTokenAuthorization, getCart);
router.post("/total", verifyTokenAuthorization, getCartTotal);
router.post("/", verifyTokenAuthorization, createCart);
router.put("/", verifyTokenAuthorization, updateCart);
router.delete("/", verifyTokenAuthorization, deleteCart);

router.get("/find/:id", verifyTokenAdminAuthorization, getUserCart);
router.get("/find", verifyTokenAdminAuthorization, getAllCart);

module.exports = router;
