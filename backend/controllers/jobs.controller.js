import Job from "../models/Job.js";

// GET /api/jobs
// Supports: ?keyword=&location=&jobType=&experienceLevel=&salaryMin=&salaryMax=&page=&limit=
export const getJobs = async (req, res) => {
  try {
    const {
      keyword,
      location,
      jobType,
      experienceLevel,
      salaryMin,
      salaryMax,
      page = 1,
      limit = 10,
    } = req.query;

    const filter = { isActive: true };

    if (keyword) {
      filter.$text = { $search: keyword };
    }
    if (location) {
      filter.location = { $regex: location, $options: "i" };
    }
    if (jobType) {
      filter.jobType = jobType;
    }
    if (experienceLevel) {
      filter.experienceLevel = experienceLevel;
    }
    if (salaryMin || salaryMax) {
      filter.salaryMax = {};
      if (salaryMin) filter.salaryMax.$gte = Number(salaryMin);
      if (salaryMax) filter.salaryMin = { $lte: Number(salaryMax) };
    }

    const skip = (Number(page) - 1) * Number(limit);

    const [jobs, total] = await Promise.all([
      Job.find(filter)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(Number(limit)),
      Job.countDocuments(filter),
    ]);

    res.status(200).json({
      jobs,
      total,
      page: Number(page),
      totalPages: Math.ceil(total / Number(limit)),
    });
  } catch (err) {
    console.error("getJobs error:", err);
    res.status(500).json({ message: "Failed to fetch jobs" });
  }
};

// GET /api/jobs/:id
export const getJobById = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);
    if (!job) {
      return res.status(404).json({ message: "Job not found" });
    }
    res.status(200).json(job);
  } catch (err) {
    console.error("getJobById error:", err);
    res.status(500).json({ message: "Failed to fetch job" });
  }
};

// POST /api/jobs  (recruiter only)
export const createJob = async (req, res) => {
  try {
    const {
      title,
      company,
      description,
      location,
      salaryMin,
      salaryMax,
      jobType,
      experienceLevel,
      skillsRequired,
    } = req.body;

    if (!title || !company || !description || !location) {
      return res.status(400).json({
        message: "title, company, description and location are required",
      });
    }

    const job = await Job.create({
      title,
      company,
      description,
      location,
      salaryMin,
      salaryMax,
      jobType,
      experienceLevel,
      skillsRequired,
      source: "direct",
      postedBy: req.user._id,
    });

    res.status(201).json(job);
  } catch (err) {
    console.error("createJob error:", err);
    res.status(500).json({ message: "Failed to create job" });
  }
};

// PUT /api/jobs/:id  (recruiter only, must own the job)
export const updateJob = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);
    if (!job) {
      return res.status(404).json({ message: "Job not found" });
    }
    if (job.source !== "direct" || String(job.postedBy) !== String(req.user._id)) {
      return res.status(403).json({ message: "Not authorized to edit this job" });
    }

    Object.assign(job, req.body);
    await job.save();

    res.status(200).json(job);
  } catch (err) {
    console.error("updateJob error:", err);
    res.status(500).json({ message: "Failed to update job" });
  }
};

// DELETE /api/jobs/:id  (recruiter only, must own the job)
export const deleteJob = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);
    if (!job) {
      return res.status(404).json({ message: "Job not found" });
    }
    if (job.source !== "direct" || String(job.postedBy) !== String(req.user._id)) {
      return res.status(403).json({ message: "Not authorized to delete this job" });
    }

    await job.deleteOne();
    res.status(200).json({ message: "Job deleted" });
  } catch (err) {
    console.error("deleteJob error:", err);
    res.status(500).json({ message: "Failed to delete job" });
  }
};

// GET /api/jobs/recruiter/mine  (recruiter only — jobs they posted)
export const getMyJobs = async (req, res) => {
  try {
    const jobs = await Job.find({
      source: "direct",
      postedBy: req.user._id,
    }).sort({ createdAt: -1 });

    res.status(200).json(jobs);
  } catch (err) {
    console.error("getMyJobs error:", err);
    res.status(500).json({ message: "Failed to fetch your jobs" });
  }
};