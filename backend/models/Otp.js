const mongoose = require("mongoose");

const otpSchema = new mongoose.Schema({
  phoneNumber: { type: String, required: true },
  otp: { type: String, required: true },
  createdAt: { type: Date, default: Date.now, expires: 300 } // 5 mins mein delete ho jayega
});

 const OTP= mongoose.model("Otp", otpSchema);
 module.exports=OTP;