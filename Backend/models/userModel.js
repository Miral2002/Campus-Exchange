const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  passwordChangedAt: {
    type: Date,
    default: Date.now() - 1000,
  },
  role: {
    type: String,
    enum: ["Admin", "User"],
    default: "User",
  },
});

module.exports = mongoose.model("user", userSchema);
