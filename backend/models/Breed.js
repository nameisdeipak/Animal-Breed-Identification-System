const mongoose = require("mongoose");

const breedSchema = new mongoose.Schema(
  {
    breedName: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },

    animalType: {
      type: String,
      enum: ["cattle", "buffalo"],
      required: true,
    },

    originState: {
      type: String,
      default: "",
    },

    description: {
      type: String,
      default: "",
    },

    characteristics: [
      {
        type: String,
      },
    ],

    averageMilkProduction: {
      type: Number,
      default: 0,
    },

    image: {
      type: String,
      default: "",
    },

    sampleImages: [
      {
        type: String,
      },
    ],

    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

 const Breed=mongoose.model("Breed", breedSchema);
 module.exports =Breed;