const express = require("express");
const authRoute = express.Router();

const {
  registerUser,
  loginUser,
  logout,
  forgotPassword,
  resetPassword,
  getProfile,updateProfile,
  sendPhoneOtp,
  verifyPhoneOtp,
  changePassword
} = require("../controllers/authController");
const userMiddleware = require("../middleware/userMiddleware");

const multer = require("multer");
const upload = multer({ dest: "uploads/" });

authRoute.get("/me", userMiddleware, getProfile);
authRoute.put("/update-profile", userMiddleware, upload.single("profileImage"), updateProfile);
authRoute.post("/send-phone-otp", userMiddleware, sendPhoneOtp);
authRoute.post("/verify-phone-otp", userMiddleware, verifyPhoneOtp);

// authetication
authRoute.post("/register", registerUser);
authRoute.post("/login", loginUser);
authRoute.get("/logout", userMiddleware, logout);

// EVery time check auth while user visit
authRoute.post("/checkAuth", userMiddleware, (req, res) => {
  try {
    const user = req.user;
    delete user.password;
    res.status(201).json({ user: user });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// forgot password API
authRoute.post("/forgot-password", forgotPassword);
authRoute.put("/reset-password/:token", resetPassword);

// Protected Route
authRoute.put("/change-password", userMiddleware, changePassword);

module.exports = authRoute;
