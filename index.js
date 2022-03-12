const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");

/**Routes Import */
const userRoute = require("./routes/user");
const authRoute = require("./routes/auth");
const productRoute = require("./routes/product");
const cartRoute = require("./routes/cart");
const orderRoute = require("./routes/order");
const paymentRoute = require("./routes/payment");

const app = express();
dotenv.config();

const PORT = process.env.PORT || 5000;

app.use(express.json());
app.use(cors());

/** Routes */
app.use("/user", userRoute);
app.use("/auth", authRoute);
app.use("/product", productRoute);
app.use("/cart", cartRoute);
app.use("/order", orderRoute);
app.use("/payment", paymentRoute);

app.get("/", (req, res) => {
  res.send("StoreX Server Running");
});


console.log("Env file check");
console.log("MongoUrl", process.env.MongoUrl);
console.log("PASS_SALT", process.env.PASS_SALT);
console.log("JWT_SALT", process.env.JWT_SALT);
console.log("razorpay_id", process.env.razorpay_id);
console.log("razorpay_secret", process.env.razorpay_secret);

// mongoose
//   .connect(process.env.MongoURL, {
//     useNewUrlParser: true,
//     useUnifiedTopology: true,
//   })
//   .then(() =>
//     app.listen(PORT, () => console.log(`Server is Running at Port: ${PORT}`))
//   )
//   .catch((error) => console.log("Error connecting to the database: ", error));
