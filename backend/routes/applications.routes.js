import express from "express";
import {
  applyToJob,
  getMyApplications,
  withdrawApplication,
  getApplicantsForJob,
  updateApplicationStatus,
  saveJob,
  unsaveJob,
  getSavedJobs,
} from "../controllers/applications.controller.js";
import { protect } from "../middleware/authMiddleware.js";
import checkRole from "../middleware/role.middleware.js";

const router = express.Router();

router.post("/:jobId", protect, checkRole("candidate"), applyToJob);
router.get("/mine", protect, checkRole("candidate"), getMyApplications);
router.delete("/:id", protect, checkRole("candidate"), withdrawApplication);

router.post("/save/:jobId", protect, checkRole("candidate"), saveJob);
router.delete("/save/:jobId", protect, checkRole("candidate"), unsaveJob);
router.get("/saved", protect, checkRole("candidate"), getSavedJobs);

router.get("/job/:jobId", protect, checkRole("recruiter"), getApplicantsForJob);
router.patch("/:id/status", protect, checkRole("recruiter"), updateApplicationStatus);

export default router;