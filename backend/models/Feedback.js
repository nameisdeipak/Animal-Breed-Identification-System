const mongoose = require("mongoose");

const feedbackSchema = new mongoose.Schema(
  {
    animal: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Animal",
    },

    givenBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },

    correctBreed: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Breed",
    },

    feedbackMessage: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
  }
);

const Feedback=mongoose.model("Feedback", feedbackSchema);
module.exports =Feedback;