const express = require("express");

const {
  verifyTokenAdminAuthorization,
  verifyTokenAuthorization,
  verifyToken,
} = require("../middleware/auth");

const {
  getOrder,
  createOrder,
  updateOrder,
  deleteOrder,
  getUserOrder,
  getAllOrder,
  getOrderStats,
  getCurrentUserSpecificOrder,
} = require("../controller/order");
const { verifyOderRequest } = require("../middleware/order");

const router = express.Router();

router.get("/", verifyTokenAuthorization, getOrder);
router.post("/", verifyTokenAuthorization, createOrder);

router.get(
  "/:id",
  verifyToken,
  verifyOderRequest,
  getCurrentUserSpecificOrder
);

router.put("/:id", verifyTokenAdminAuthorization, updateOrder);
router.delete("/:id", verifyTokenAdminAuthorization, deleteOrder);
router.get("/find/:id", verifyTokenAdminAuthorization, getUserOrder);
router.get("/find", verifyTokenAdminAuthorization, getAllOrder);
router.get("/stats", verifyTokenAdminAuthorization, getOrderStats);

module.exports = router;
