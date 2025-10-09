const { Model } = require("mongoose");
const User = require("../models/userModel.js");
const OTP = require("../models/otpModel.js");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const transporter = require("../config/nodemailer.js");

const register = async (req, res) => {
  const { name, email, password, otp } = req.body;

  if (!name || !email || !password || !otp) {
    return res.status(400).json({
      success: false,
      message: "Missing Details",
    });
  }

  try {
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: "User already exist.",
      });
    }

    const regex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    if (!regex.test(password)) {
      return res.status(422).json({
        success: false,
        message: "Please enter strong password.",
      });
    }

    const actualOtp = await OTP.findOne({ email }).sort({ createdAt: -1 });
    if (
      !actualOtp ||
      otp !== actualOtp.otp ||
      actualOtp.otpType !== "AccountCreate"
    ) {
      return res.status(401).json({
        success: false,
        message: "Invalid otp.",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      name,
      email,
      password: hashedPassword,
      role: "User",
      passwordChangedAt: Date.now() - 1000,
    });

    await newUser.save();

    const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    // sending welcome email
    const mailOptions = {
      from: process.env.SENDER_EMAIL,
      to: email,
      subject: "Welcome to Campus Exchange",
      text: `Welcome to Campus Exchange. your account has been created using email id: ${email}`,
    };

    if (process.env.NODE_ENV !== "test")
      await transporter.sendMail(mailOptions);

    await OTP.deleteMany({ email: email });

    return res.status(201).json({
      success: true,
      message: "User registered successfully.",
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

const login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res
      .status(400)
      .json({ success: false, messgage: "Missing details." });
  }

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password.",
      });
    }

    const isMatching = await bcrypt.compare(password, user.password);

    if (!isMatching) {
      return res
        .status(401)
        .json({ success: false, message: "Invalid email or password." });
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return res
      .status(200)
      .json({ success: true, message: "Logged in Successfully." });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

const logout = async (req, res) => {
  try {
    res.clearCookie("token", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
    });

    return res
      .status(200)
      .json({ success: true, message: "Logged Out successfully." });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

const isAuthenticated = async (req, res) => {
  try {
    return res.status(200).json({ success: true });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

const resetPassword = async (req, res) => {
  const { userId, oldPassword, newPassword } = req.body;

  if (!userId || !oldPassword || !newPassword) {
    return res.status(400).json({ success: false, message: "Missing details" });
  }

  try {
    const user = await User.findOne({ _id: userId });

    const isMatching = await bcrypt.compare(oldPassword, user.password);

    if (!isMatching) {
      return res.status(401).json({
        success: false,
        message: "Invalid password.",
      });
    }

    const regex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    if (!regex.test(newPassword)) {
      return res.status(422).json({
        success: false,
        message: "Please enter strong password.",
      });
    }

    const newHashedPassword = await bcrypt.hash(newPassword, 10);

    user.passwordChangedAt = Date.now() - 1000;
    user.password = newHashedPassword;

    await user.save();

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return res
      .status(200)
      .json({ success: true, message: "Password changed successfully." });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

const forgotPassword = async (req, res) => {
  const { email, otp, newPassword } = req.body;

  if (!email || !otp || !newPassword) {
    return res.status(400).json({
      success: false,
      message: "Missing Details.",
    });
  }

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res
        .status(401)
        .json({ success: false, message: "Invalid email or OTP." });
    }

    const actualOtp = await OTP.findOne({ email }).sort({ createdAt: -1 });

    if (
      !actualOtp ||
      otp !== actualOtp.otp ||
      actualOtp.otpType !== "PasswordReset"
    ) {
      return res
        .status(401)
        .json({ success: false, message: "Invalid email or OTP." });
    }

    const regex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    if (!regex.test(newPassword)) {
      return res.status(422).json({
        success: false,
        message: "Please enter strong password.",
      });
    }

    const newHashedPassword = await bcrypt.hash(newPassword, 10);

    user.password = newHashedPassword;
    user.passwordChangedAt = Date.now() - 1000;

    await user.save();

    await OTP.deleteMany({ email: email });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return res
      .status(200)
      .json({ success: true, message: "Password changed successfully." });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

module.exports = {
  register,
  login,
  logout,
  isAuthenticated,
  resetPassword,
  forgotPassword,
};
