import mongoose from "mongoose";

const resumeSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    fileName: { type: String, required: true },
    rawText: { type: String, required: true },
    parsedData: {
      skills: [String],
      experience: [String],
      education: [String],
    },
    atsScore: { type: Number, default: null },
    atsFeedback: { type: String, default: "" },
    jdMatch: {
      jobDescription: String,
      matchPercent: Number,
      missingKeywords: [String],
      suggestions: [String],
    },
    coverLetter: { type: String, default: "" },
  },
  { timestamps: true }
);

export default mongoose.model("Resume", resumeSchema);