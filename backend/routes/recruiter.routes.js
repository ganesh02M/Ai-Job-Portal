import express from "express";
import {
  postJob,
  updateJob,
  deleteJob,
  getMyJobs,
  getApplicantsForJob,
  updateApplicationStatus,
} from "../controllers/recruiter.controller.js";
import { protect } from "../middleware/authMiddleware.js";
import checkRole from "../middleware/role.middleware.js";

const router = express.Router();

router.use(protect, checkRole("recruiter"));

router.post("/jobs", postJob);
router.put("/jobs/:id", updateJob);
router.delete("/jobs/:id", deleteJob);
router.get("/jobs", getMyJobs);

router.get("/jobs/:jobId/applicants", getApplicantsForJob);
router.patch("/applications/:id/status", updateApplicationStatus);

export default router;