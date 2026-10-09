const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    password: {
      type: String,
      required: true,
    },

    role: {
      type: String,
      enum: ["admin", "flw"],
      default: "flw",
    },

    phoneNumber: {
      type: String,
      default: "",
    },

    employeeId: {
      type: String,
      unique: true,
      sparse: true,
    },

    profileImage: {
      type: String,
      default: "",
    },

    state: {
      type: String,
      default: "",
    },

    district: {
      type: String,
      default: "",
    },

    village: {
      type: String,
      default: "",
    },

    isActive: {
      type: Boolean,
      default: true,
    },

    lastLogin: {
      type: Date,
    },
    resetPasswordToken: String,
    resetPasswordExpire: Date,
  },
  {
    timestamps: true,
  },
);

const User = mongoose.model("User", userSchema);
module.exports = User;
