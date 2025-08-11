const mongoose = require("mongoose");

const feedbackSchema = new mongoose.Schema(
  {
    admin: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    formId: {
      type: String,
      required: true,
      unique: true,
    },
    responses: [
      {
        name: String,
        email: String,
        message: String,
        submittedAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Feedback", feedbackSchema);
