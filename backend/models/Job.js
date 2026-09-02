import mongoose from "mongoose";

const jobSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    company: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
    },
    location: {
      type: String,
      required: true,
      trim: true,
    },
    salaryMin: {
      type: Number,
    },
    salaryMax: {
      type: Number,
    },
    jobType: {
      type: String,
      enum: ["full-time", "part-time", "internship", "remote", "contract"],
      default: "full-time",
    },
    experienceLevel: {
      type: String,
      enum: ["fresher", "0-1", "1-3", "3-5", "5+"],
      default: "fresher",
    },
    skillsRequired: {
      type: [String],
      default: [],
    },

    // Distinguishes recruiter-posted jobs from Indeed-fetched jobs
    source: {
      type: String,
      enum: ["direct", "external"],
      default: "direct",
      required: true,
    },

    // Only set for source: "direct" — links to the recruiter (User) who posted it
    postedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: function () {
        return this.source === "direct";
      },
    },

    // Only set for source: "external" — where to send the candidate to apply
    externalApplyUrl: {
      type: String,
      required: function () {
        return this.source === "external";
      },
    },

    // Only set for source: "external" — Indeed's own job id, used to avoid duplicate syncs
    externalJobId: {
      type: String,
      unique: true,
      sparse: true, // allows null for direct jobs while still enforcing uniqueness for external ones
    },

    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

// Speeds up the common /jobs filter queries (keyword + location + type)
jobSchema.index({ title: "text", company: "text", skillsRequired: "text" });
jobSchema.index({ location: 1, jobType: 1, experienceLevel: 1 });

export default mongoose.model("Job", jobSchema);