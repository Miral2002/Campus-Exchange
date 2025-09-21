const jwt = require("jsonwebtoken");
const User = require("../models/userModel.js");

const authMiddleware = async (req, res, next) => {
  const token = req.cookies.token;

  if (!token) {
    return res.status(401).json({
      success: false,
      message: "Not authorised. Sign in again.",
    });
  }

  try {
    const tokenDecode = jwt.verify(token, process.env.JWT_SECRET);

    if (tokenDecode.id) {
      const user = await User.findOne({ _id: tokenDecode.id });

      if (!user) {
        return res.status(401).json({
          success: false,
          message: "User not found.",
        });
      }

      if (tokenDecode.iat * 1000 < user.passwordChangedAt.getTime()) {
        console.log("Decoded Token:", tokenDecode);
        console.log("passwordChangedAt:", user.passwordChangedAt);
        return res.status(401).json({
          success: false,
          message: "Not authorised. Sign in again.",
        });
      }

      req.body.userId = tokenDecode.id;
    } else {
      return res.status(401).json({
        success: false,
        message: "Not authorised. Sign in again.",
      });
    }

    next();
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

module.exports = authMiddleware;
