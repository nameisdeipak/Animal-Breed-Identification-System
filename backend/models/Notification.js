const mongoose = require("mongoose");

const notificationSchema = new mongoose.Schema(
  {
    message: { type: String, required: true },
    type: {
      type: String,
      enum: ["new_registration", "user_enrollment", "system_alert"],
      required: true,
    },
    linkId: { type: String }, // Ye Animal ID ya User ID hogi
    isRead: { type: Boolean, default: false },
  },
  { timestamps: true },
);
const Notification = mongoose.model("Notification", notificationSchema);
module.exports = Notification;
