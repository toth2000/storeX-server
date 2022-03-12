const express = require("express");

const {
  verifyTokenAuthorization,
  verifyTokenAdminAuthorization,
} = require("../middleware/auth");

const {
  updateUser,
  deleteUser,
  getUser,
  getAllUser,
  getUserStats,
} = require("../controller/user");

const router = express.Router();

router.get("/find", verifyTokenAdminAuthorization, getAllUser);
router.get("/stats", verifyTokenAdminAuthorization, getUserStats);

router.put("/:id", verifyTokenAuthorization, updateUser);
router.delete("/:id", verifyTokenAuthorization, deleteUser);
router.get("/find/:id", verifyTokenAdminAuthorization, getUser);

module.exports = router;
