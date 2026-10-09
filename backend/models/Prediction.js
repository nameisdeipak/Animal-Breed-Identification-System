const mongoose = require("mongoose");

const predictionSchema = new mongoose.Schema(
  {
    animal: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Animal",
    },

    predictedBreed: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Breed",
    },

    confidenceScore: {
      type: Number,
      required: true,
    },

    topPredictions: [
      {
        breed: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Breed",
        },

        confidence: Number,
      },
    ],

    aiModelVersion: {
      type: String,
      default: "v1",
    },
  },
  {
    timestamps: true,
  }
);

 const Prediction= mongoose.model("Prediction", predictionSchema);
 module.exports =Prediction