const express = require("express");

const { verifyTokenAdminAuthorization } = require("../middleware/auth");
const {
  createProduct,
  updateProduct,
  deleteProduct,
  getProduct,
  getAllProduct,
} = require("../controller/product");

const router = express.Router();

router.post("/", verifyTokenAdminAuthorization, createProduct);
router.put("/:id", verifyTokenAdminAuthorization, updateProduct);
router.delete("/:id", verifyTokenAdminAuthorization, deleteProduct);

router.get('/find/:id', getProduct);
router.get("/find", getAllProduct);

module.exports = router;
