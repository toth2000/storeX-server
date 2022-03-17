const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");

const User = require("../models/User");

const verifyToken = (req, res, next) => {
  try {
    const authHeader = req.headers.token;

    const SALT = process.env.ACCESS_TOKEN_SECRET;

    if (authHeader) {
      const token = authHeader.split(" ")[1];
      jwt.verify(token, SALT, (err, decodedToken) => {
        if (err instanceof jwt.TokenExpiredError)
          return res.status(401).json({ message: "Access Token Expired" });

        if (err)
          return res
            .status(403)
            .json({ message: "Invalid token, authentication is required" });

        req.userId = decodedToken.id;
        next();
      });
    } else {
      return res.status(401).json({ message: "Authentication required" });
    }
  } catch (err) {
    console.log("Auth middleware, verifyToken: ", err);
    return res.status(500).json({ message: "Server Error" });
  }
};

const verifyTokenAuthorization = (req, res, next) => {
  verifyToken(req, res, async () => {
    try {
      const { id } = req.params;

      if (id && !mongoose.Types.ObjectId.isValid(id))
        return res.status(406).json({ message: "Invalid id" });

      const user = await User.findOne({ _id: req.userId });
      if (!user)
        return res.status(404).json({ message: "User does not exists" });

      if (!id || req.userId === id || user.isAdmin) {
        req.user = user;
        next();
      } else {
        console.log("req.userId: ", req.userId, " id: ", id);
        return res.status(403).json({ message: "This action is not allowed" });
      }
    } catch (err) {
      console.log("Auth MiddleWare, verifyToken: ", err);
      return res.status(500).json({ message: "Server error" });
    }
  });
};

const verifyTokenAdminAuthorization = (req, res, next) => {
  verifyToken(req, res, async () => {
    try {
      const { id } = req.params;

      if (id && !mongoose.Types.ObjectId.isValid(id))
        return res.status(406).json({ message: "Invalid id" });

      const user = await User.findOne({ _id: req.userId });

      if (!user)
        return res.status(404).json({ message: "User does not exists" });

      if (user.isAdmin) {
        req.user = user;
        next();
      } else {
        return res
          .status(403)
          .json({ message: "Only Admin can perform this action" });
      }
    } catch (err) {
      console.log("Auth MiddleWare, verifyToken: ", err);
      return res.status(500).json({ message: "Server error" });
    }
  });
};

module.exports = {
  verifyToken,
  verifyTokenAuthorization,
  verifyTokenAdminAuthorization,
};
