import Application from "../models/Application.js";
import Job from "../models/Job.js";
import SavedJob from "../models/SavedJob.js";
// SmartHire's match logic lives inside resumeController.js (POST /api/resume/:id/match),
// not a separate service file. Either call that function directly if you export it,
// or hit that endpoint internally. Example once wired:
// import { matchResumeToJD } from "./resumeController.js";

// POST /api/applications/:jobId  (candidate only)
// body: { resumeId }
export const applyToJob = async (req, res) => {
  try {
    const { jobId } = req.params;
    const { resumeId } = req.body;

    const job = await Job.findById(jobId);
    if (!job || !job.isActive) {
      return res.status(404).json({ message: "Job not found or inactive" });
    }
    if (job.source === "external") {
      return res.status(400).json({
        message: "This is an external job — apply via the external link instead",
      });
    }
    if (!resumeId) {
      return res.status(400).json({ message: "resumeId is required" });
    }

    // Optional: compute match score at application time using jdMatch.service
    let matchScore, missingKeywords;
    // const result = await getMatchScore(resumeId, job.description);
    // matchScore = result.matchScore;
    // missingKeywords = result.missingKeywords;

    const application = await Application.create({
      job: jobId,
      candidate: req.user._id,
      resume: resumeId,
      matchScore,
      missingKeywords,
    });

    res.status(201).json(application);
  } catch (err) {
    if (err.code === 11000) {
      return res.status(409).json({ message: "You already applied to this job" });
    }
    console.error("applyToJob error:", err);
    res.status(500).json({ message: "Failed to apply" });
  }
};

// GET /api/applications/mine  (candidate only)
export const getMyApplications = async (req, res) => {
  try {
    const applications = await Application.find({ candidate: req.user._id })
      .populate("job")
      .sort({ createdAt: -1 });

    res.status(200).json(applications);
  } catch (err) {
    console.error("getMyApplications error:", err);
    res.status(500).json({ message: "Failed to fetch applications" });
  }
};

// DELETE /api/applications/:id  (candidate only, must own it)
export const withdrawApplication = async (req, res) => {
  try {
    const application = await Application.findById(req.params.id);
    if (!application) {
      return res.status(404).json({ message: "Application not found" });
    }
    if (String(application.candidate) !== String(req.user._id)) {
      return res.status(403).json({ message: "Not authorized" });
    }

    await application.deleteOne();
    res.status(200).json({ message: "Application withdrawn" });
  } catch (err) {
    console.error("withdrawApplication error:", err);
    res.status(500).json({ message: "Failed to withdraw application" });
  }
};

// GET /api/applications/job/:jobId  (recruiter only, must own the job)
// Returns applicants ranked by matchScore (highest first)
export const getApplicantsForJob = async (req, res) => {
  try {
    const job = await Job.findById(req.params.jobId);
    if (!job) {
      return res.status(404).json({ message: "Job not found" });
    }
    if (String(job.postedBy) !== String(req.user._id)) {
      return res.status(403).json({ message: "Not authorized" });
    }

    const applicants = await Application.find({ job: req.params.jobId })
      .populate("candidate", "name email")
      .populate("resume")
      .sort({ matchScore: -1, createdAt: -1 });

    res.status(200).json(applicants);
  } catch (err) {
    console.error("getApplicantsForJob error:", err);
    res.status(500).json({ message: "Failed to fetch applicants" });
  }
};

// PATCH /api/applications/:id/status  (recruiter only)
// body: { status: "shortlisted" | "rejected" | "hired" }
export const updateApplicationStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const application = await Application.findById(req.params.id).populate("job");
    if (!application) {
      return res.status(404).json({ message: "Application not found" });
    }
    if (String(application.job.postedBy) !== String(req.user._id)) {
      return res.status(403).json({ message: "Not authorized" });
    }

    application.status = status;
    await application.save();

    res.status(200).json(application);
  } catch (err) {
    console.error("updateApplicationStatus error:", err);
    res.status(500).json({ message: "Failed to update status" });
  }
};

// POST /api/applications/save/:jobId  (candidate only) — bookmark a job
export const saveJob = async (req, res) => {
  try {
    const saved = await SavedJob.create({
      candidate: req.user._id,
      job: req.params.jobId,
    });
    res.status(201).json(saved);
  } catch (err) {
    if (err.code === 11000) {
      return res.status(409).json({ message: "Job already saved" });
    }
    console.error("saveJob error:", err);
    res.status(500).json({ message: "Failed to save job" });
  }
};

// DELETE /api/applications/save/:jobId  (candidate only) — remove bookmark
export const unsaveJob = async (req, res) => {
  try {
    await SavedJob.findOneAndDelete({
      candidate: req.user._id,
      job: req.params.jobId,
    });
    res.status(200).json({ message: "Job unsaved" });
  } catch (err) {
    console.error("unsaveJob error:", err);
    res.status(500).json({ message: "Failed to unsave job" });
  }
};

// GET /api/applications/saved  (candidate only)
export const getSavedJobs = async (req, res) => {
  try {
    const saved = await SavedJob.find({ candidate: req.user._id }).populate("job");
    res.status(200).json(saved);
  } catch (err) {
    console.error("getSavedJobs error:", err);
    res.status(500).json({ message: "Failed to fetch saved jobs" });
  }
};