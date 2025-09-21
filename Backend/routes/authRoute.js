const express = require("express");
const {
  register,
  login,
  logout,
  isAuthenticated,
  resetPassword,
  forgotPassword,
} = require("../controllers/authControllers");
const authMiddleware = require("../middlewares/authMiddleware");
const authRouter = express.Router();

authRouter.post("/register", register);
authRouter.post("/login", login);
authRouter.post("/logout", logout);
authRouter.get("/is-auth", authMiddleware, isAuthenticated);
authRouter.put("/reset-password", authMiddleware, resetPassword);
authRouter.put("/forgot-password", forgotPassword);

module.exports = authRouter;
