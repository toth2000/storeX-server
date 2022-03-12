const express = require("express");
const { registerUser, loginUser } = require("../controller/auth");

const router = express.Router();

router.get("/", (req, res) => {
  res.send("Auth Route");
});

// User Registration and login
router.post("/register", registerUser);
router.post("/login", loginUser);

module.exports = router;
