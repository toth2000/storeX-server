const CryptoJs = require("crypto-js");
const jwt = require("jsonwebtoken");

const User = require("../models/User");

const jwtSign = (user) => {
  const jwtSalt = process.env.JWT_SALT;

  const token = jwt.sign(
    {
      id: user._id,
      isAdmin: user.isAdmin,
    },
    jwtSalt,
    { expiresIn: "2d" }
  );

  // Destructing password and other from user object
  // To return user without hashed password
  const { password, ...others } = user._doc;

  return { ...others, token };
};

const registerUser = async (req, res) => {
  try {
    const { fullName, username, email, password } = req.body;

    if (!fullName || !username || !email || !password) {
      return res
        .status(400)
        .json({ message: "User data is incomplete to create a new account" });
    }

    const existingUser = await User.findOne({
      $or: [{ email: email }, { username: username }],
    });

    if (existingUser)
      return res.status(405).json({ message: "User already Exists" });

    const SALT = process.env.PASS_SALT.toString();
    const encryptedPassword = CryptoJs.AES.encrypt(password, SALT);

    const newUser = new User({
      fullName: fullName,
      username: username,
      email: email,
      password: encryptedPassword,
    });

    const savedUser = await newUser.save();
    const response = jwtSign(savedUser);

    return res.status(200).json(response);
  } catch (error) {
    console.log("auth.js controlled, registerUser function ", error);
    return res.status(500).json({ message: "Server Error" });
  }
};

const loginUser = async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password)
      return res
        .status(400)
        .json({ message: "username and password are required" });

    const user = await User.findOne({ username: username });

    if (!user) return res.status(404).json({ message: "User does not exists" });

    const SALT = process.env.PASS_SALT.toString();
    const decryptedPassword = CryptoJs.AES.decrypt(
      user.password,
      SALT
    ).toString(CryptoJs.enc.Utf8);

    if (decryptedPassword !== password)
      return res.status(406).json({ message: "Invalid password or username" });

    const response = jwtSign(user);

    return res.status(200).json(response);
  } catch (error) {
    console.log("Auth controlled, loginUser method", error);
    return res.status(500).json({ message: "Server Error" });
  }
};

module.exports = { registerUser, loginUser, jwtSign };