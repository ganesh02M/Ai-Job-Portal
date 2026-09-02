import mongoose from "mongoose";

const savedJobSchema = new mongoose.Schema(
  {
    candidate: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    job: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Job",
      required: true,
    },
  },
  { timestamps: true }
);

// A candidate can only save a job once
savedJobSchema.index({ candidate: 1, job: 1 }, { unique: true });

export default mongoose.model("SavedJob", savedJobSchema);