import mongoose from "mongoose";

const applicationSchema = new mongoose.Schema(
  {
    job: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Job",
      required: true,
    },
    candidate: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    // Snapshot of the resume used for this specific application
    // (candidate's resume may change later — this keeps the applied version)
    resume: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Resume",
      required: true,
    },

    // Cached result from matchResumeToJD (utils/groqClient.js) at the time of applying/checking
    matchScore: {
      type: Number,
      min: 0,
      max: 100,
    },
    missingKeywords: {
      type: [String],
      default: [],
    },

    status: {
      type: String,
      enum: ["applied", "shortlisted", "rejected", "hired"],
      default: "applied",
    },
  },
  { timestamps: true }
);

// A candidate can only apply once to the same job
applicationSchema.index({ job: 1, candidate: 1 }, { unique: true });

export default mongoose.model("Application", applicationSchema);