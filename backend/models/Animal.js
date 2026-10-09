const mongoose = require("mongoose");

const animalSchema = new mongoose.Schema(
  {
    animalType: {
      type: String,
      enum: ["cattle", "buffalo"],
      required: true,
    },

    predictedBreed: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Breed",
    },

    confirmedBreed: {
      type:String,
      ref: "Breed",
    },

    confidenceScore: {
      type: Number,
      default: 0,
    },

    imageUrl: {
      type: String,
      required: true,
    },

    additionalImages: [
      {
        type: String,
      },
    ],

    ownerName: {
      type: String,
      required: true,
    },

    ownerPhone: {
      type: String,
      default: "",
    },

    village: {
      type: String,
      default: "",
    },

    district: {
      type: String,
      default: "",
    },

    state: {
      type: String,
      default: "",
    },

    age: {
      type: Number,
      default: 0,
    },

    weight: {
      type: Number,
      default: 0,
    },

    milkCapacityPerDay: {
      type: Number,
      default: 0,
    },

    gender: {
      type: String,
      enum: ["male", "female"],
      default: "female",
    },

    uploadedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },

    registrationStatus: {
      type: String,
      enum: ["pending", "verified", "rejected"],
      default: "pending",
    },

    notes: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
  }
);

const Animal=mongoose.model("Animal", animalSchema);
module.exports = Animal