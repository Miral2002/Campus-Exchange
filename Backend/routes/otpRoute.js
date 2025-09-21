const express = require("express");
const { sendCreateOtp, sendResetOtp } = require("../controllers/otpController");
const authMiddleware = require("../middlewares/authMiddleware");
const otpRouter = express.Router();

otpRouter.post("/send-create-otp", sendCreateOtp);
otpRouter.post("/send-reset-otp", sendResetOtp);

module.exports = otpRouter;
