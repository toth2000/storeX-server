const express = require("express");

const { verifyTokenAdminAuthorization, verifyTokenAuthorization } = require("../middleware/auth");
const { getPaymentDetail, verifyPayment } = require("../controller/payment");

const router = express.Router();

router.get("/", (req, res) => {
  res.send("Payment Route");
});

router.get("/:paymentId", verifyTokenAdminAuthorization, getPaymentDetail);
router.post('/verify', verifyTokenAuthorization, verifyPayment);

module.exports = router;
