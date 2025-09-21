const User = require("../models/userModel");
const OTP = require("../models/otpModel.js");
const otpGenerator = require("otp-generator");
const transporter = require("../config/nodemailer.js");

const sendCreateOtp = async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({
      success: true,
      message: "Missing details",
    });
  }

  try {
    const user = await User.findOne({ email: email });

    if (user) {
      return res.status(200).json({
        success: true,
        message:
          "If an account with this email doesn't exists, an OTP has been sent.",
      });
    }

    // const emailDomain = email.split("@");
    // if (emailDomain.length > 2 || emailDomain[1] !== "iitgn.ac.in") {
    //   return res.status(400).json({
    //     success: false,
    //     message: "Invalid Email",
    //   });
    // }

    const otp = otpGenerator.generate(6, {
      upperCaseAlphabets: false,
      lowerCaseAlphabets: false,
      specialChars: false,
    });

    let result = await OTP.findOne({ otp: otp });
    while (result) {
      otp = otpGenerator.generate(6, {
        upperCaseAlphabets: false,
        lowerCaseAlphabets: false,
        specialChars: false,
      });

      result = await OTP.findOne({ otp: otp });
    }

    const newOTP = new OTP({ otp, email, otpType: "AccountCreate" });
    await newOTP.save();

    // sending welcome email
    const mailOptions = {
      from: process.env.SENDER_EMAIL,
      to: email,
      subject: "Campus Exchange OTP",
      text: `OTP for Campus Exchange account creation: ${otp}. Otp will expires in 5 minutes.`,
    };

    await transporter.sendMail(mailOptions);

    return res.status(200).json({
      success: true,
      message:
        "If an account with this email doesn't exists, an OTP has been sent.",
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

const sendResetOtp = async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({
      success: true,
      message: "Missing details",
    });
  }

  try {
    const user = await User.findOne({ email: email });

    if (!user) {
      return res.status(200).json({
        success: true,
        message: "If an account with this email exists, an OTP has been sent.",
      });
    }

    const otp = otpGenerator.generate(6, {
      upperCaseAlphabets: false,
      lowerCaseAlphabets: false,
      specialChars: false,
    });

    let result = await OTP.findOne({ otp: otp });
    while (result) {
      otp = otpGenerator.generate(6, {
        upperCaseAlphabets: false,
        lowerCaseAlphabets: false,
        specialChars: false,
      });

      result = await OTP.findOne({ otp: otp });
    }

    const newOTP = new OTP({ otp, email, otpType: "PasswordReset" });
    await newOTP.save();

    // sending welcome email
    const mailOptions = {
      from: process.env.SENDER_EMAIL,
      to: email,
      subject: "Campus Exchange OTP",
      text: `OTP for Campus Exchange password reset: ${otp}. Otp will expire in 5 minutes.`,
    };

    await transporter.sendMail(mailOptions);

    return res.status(200).json({
      success: true,
      message: "If an account with this email exists, an OTP has been sent.",
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

module.exports = { sendCreateOtp, sendResetOtp };
