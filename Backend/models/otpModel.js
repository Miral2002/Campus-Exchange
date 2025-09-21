const mongoose = require("mongoose");

const otpSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
  },
  otp: {
    type: String,
    required: true,
  },
  otpType: {
    type: String,
    required: true,
    enum: ["AccountCreate", "PasswordReset"],
  },
  createdAt: {
    type: Date,
    default: Date.now(),
    expires: 60 * 5, // otp expires after 5 minutes
  },
});

module.exports = mongoose.model("otp", otpSchema);
