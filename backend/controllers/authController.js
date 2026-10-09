const bcrypt = require("bcryptjs");

const User = require("../models/User");
const jwt = require("jsonwebtoken");
const { regisValidator, loginValidator } = require("../utils/validation");
const sendEmail = require("../utils/sendEmail");
const cloudinary = require("../config/cloudinary");
const axios = require('axios');
const OTP = require("../models/Otp");
const Notification = require("../models/Notification");

// REGISTER
const registerUser = async (req, res) => {
  try {
    const {
      fullName,
      email,
      password,
      phoneNumber,
      state,
      district,
      village,
    } = req.body;

    regisValidator(req.body);

    if (req.body.phoneNumber) {
      const phoneRegex = /^\+[1-9]\d{7,14}$/;

      if (!phoneRegex.test(req.body.phoneNumber)) {
        return res.status(400).json({
          message: "Invalid phone number format",
        });
      }

      const existingPhone = await User.findOne({
        phoneNumber: req.body.phoneNumber,
      });

      if (existingPhone) {
        return res.status(400).json({
          message: "Phone already in use",
        });
      }
    }
    // check existing user
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "User already exists",
      });
    }

    // hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // create user
    const user = await User.create({
      fullName,
      email,
      password: hashedPassword,
      role: "flw",
      isActive: false, 
      phoneNumber,
      state,
      district,
      village,
    });

    // generate token
    const token = jwt.sign(
      {
        id: user._id,
        email: email,
        role: user.role,
      },
      process.env.JWT_SECRET,
      { expiresIn: "1d" },
    );

    // send cookie
    res.cookie("token", token, {
      httpOnly: true,
      secure: false,
      sameSite: "lax",
      maxAge: 24 * 60 * 60 * 1000,
    });

    await Notification.create({
    message: `New Officer enrollment request: ${fullName} is waiting for activation`,
    type: "user_enrollment",
    linkId: user._id
});
    const userObj = user.toObject();
    delete userObj.password;

    return res.status(201).json({
      message: "Registration successful. Please wait for Admin approval to access the portal.",
      user: userObj,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// LOGIN
const loginUser = async (req, res) => {
  try {
    loginValidator(req.body);
    const { email, password } = req.body;

    // check user
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // compare password
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({ message: "Invalid Password" });
    }

    // if (!user.isActive) { return res.status(403).json({ message: "Wait for approval" }); }

    // generate token
    const token = jwt.sign(
      { id: user._id, email: user.email, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1d" },
    );
    // cookie
    res.cookie("token", token, {
      httpOnly: true,
      secure: false,
      sameSite: "lax",
      maxAge: 24 * 60 * 60 * 1000,
    });

    const userObj = user.toObject();
    delete userObj?.password;
    res.status(201).json({
      message: "Login Successfully",
      user: userObj,
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// LOGOUT
const logout = async (req, res) => {
  try {
    const { token } = req.cookies;
    const payload = jwt.decode(token);

    // await redisClient.set(`token:${token}`, "Blocked");
    // await redisClient.expireAt(`token:${token}`, payload.exp);

    res.cookie("token", null, { expires: new Date(Date.now()) });
    // res.clearCookie("token", {
    //   httpOnly: true,
    //   secure: false,
    //   sameSite: "lax",
    // });
    res.send("Logged Out Successfully");
  } catch (err) {
    res.status(503).send("Error: " + err);
  }
};

const crypto = require("crypto"); // used to random sets

// Forgot Password - Send Link
const forgotPassword = async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    // console.log(user)
    if (!user) {
      return res
        .status(404)
        .json({ message: "User not found with this email" });
    }

    // console.log("buggg 1")

    // Generate Reset Token
    const resetToken = crypto.randomBytes(20).toString("hex");
    // console.log("buggg 2")

    // Hash token and save to DB
    user.resetPasswordToken = crypto
      .createHash("sha256")
      .update(resetToken)
      .digest("hex");
    user.resetPasswordExpire = Date.now() + 15 * 60 * 1000; // 15 Minutes in expire
    // console.log("buggg 3")

    await user.save();

    // console.log("buggg 4")
    // Reset Link URL
    
    const resetUrl = `http://localhost:5173/reset-password/${resetToken}`;

    const message = `Aapke account ka password reset karne ke liye is link par click karein: \n\n ${resetUrl} \n\n Agar aapne ye request nahi ki hai, toh ise ignore karein.`;

    // console.log("buggg 5")
    try {
      await sendEmail({
        email: user.email,
        subject: "DairyPro Password Reset Request",
        message,
      });
      // console.log("buggg 6")

      res.status(200).json({ message: "Reset link sent to your email!" });
    } catch (err) {
      user.resetPasswordToken = undefined;
      user.resetPasswordExpire = undefined;
      await user.save();
      return res.status(500).json({ message: "Email could not be sent" });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Reset Password Logic
const resetPassword = async (req, res) => {
  try {
    // Hash the token from URL to match with DB
    const resetPasswordToken = crypto
      .createHash("sha256")
      .update(req.params.token)
      .digest("hex");

    const user = await User.findOne({
      resetPasswordToken,
      resetPasswordExpire: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({ message: "Invalid or Expired Token" });
    }

    // Hash new password and save
    user.password = await bcrypt.hash(req.body.password, 10);
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;

    await user.save();
    res.status(200).json({ message: "Password updated successfully!" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get Profile
const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


const updateProfile = async (req, res) => {
  try {
    const { fullName, village, district, state } = req.body;

    let updateData = {};
    if (fullName) updateData.fullName = fullName;
    if (village) updateData.village = village;
    if (district) updateData.district = district;
    if (state) updateData.state = state;

    if (req.file) {
      const result = await cloudinary.uploader.upload(req.file.path, {
        folder: "user_profiles",
      });
      updateData.profileImage = result.secure_url;
    }

    const updatedUser = await User.findByIdAndUpdate(
      req.user._id,
      { $set: updateData }, 
      {returnDocument: "after" } 
    ).select("-password").lean(); 

    res.status(200).json({ success: true, message: "Profile Updated", user: updatedUser });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};



// 1. OTP Bhejna (Simulated or via Service)
const sendPhoneOtp = async (req, res) => {
  try {
    const { phoneNumber } = req.body;
    const otp = Math.floor(100000 + Math.random() * 900000).toString(); // 6 Digit OTP

    // Save OTP to DB
    await OTP.findOneAndUpdate(
      { phoneNumber },
      { otp },
      { upsert: true,  returnDocument: "after" },
    );

    // Minor Project hai isliye Console mein dikhayenge (Real project mein Twilio/Msg91 lagega)
    console.log(`OTP for ${phoneNumber} is: ${otp}`);

    res
      .status(200)
      .json({ success: true, message: "OTP sent to " + phoneNumber });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};



const verifyPhoneOtp = async (req, res) => {
  try {
    const { phoneNumber, otp } = req.body;
    const otpDoc = await OTP.findOne({ phoneNumber, otp });

    if (!otpDoc)
      return res.status(400).json({ message: "Invalid or Expired OTP" });

    // Update User's Phone Number
    const updatedUser = await User.findByIdAndUpdate(
      req.user._id,
      { phoneNumber },
      { returnDocument: "after" },
    ).select("-password");

    // Delete OTP after use
    await OTP.deleteOne({ _id: otpDoc._id });

    res
      .status(200)
      .json({ message: "Phone Number Verified & Updated", user: updatedUser });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


const changePassword = async (req, res) => {
  try {
    const { oldPassword, newPassword } = req.body;

    // 1. User fetch karo password field ke saath (humne schema me select:false kiya hoga shayad)
    const user = await User.findById(req.user._id);

    // 2. Old password verify karo
    const isMatch = await bcrypt.compare(oldPassword, user.password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: "current password is wrong" });
    }

    // 3. New password aur Old password same to nahi?
    const isSame = await bcrypt.compare(newPassword, user.password);
    if (isSame) {
      return res.status(400).json({ success: false, message: "new Password is must to different to old password" });
    }

    // 4. Hash naya password and save
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    await user.save();

    res.status(200).json({ success: true, message: "Password Successfully updated" });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

module.exports = {
  registerUser,
  loginUser,
  logout,
  forgotPassword,
  resetPassword,
  getProfile,
  updateProfile,
  sendPhoneOtp,
  verifyPhoneOtp,
  changePassword
};
