import express from "express";
import {
  getJobs,
  getJobById,
  createJob,
  updateJob,
  deleteJob,
  getMyJobs,
} from "../controllers/jobs.controller.js";
import { protect } from "../middleware/authMiddleware.js";
import checkRole from "../middleware/role.middleware.js";

const router = express.Router();

router.get("/", getJobs);
router.get("/recruiter/mine", protect, checkRole("recruiter"), getMyJobs);
router.get("/:id", getJobById);

router.post("/", protect, checkRole("recruiter"), createJob);
router.put("/:id", protect, checkRole("recruiter"), updateJob);
router.delete("/:id", protect, checkRole("recruiter"), deleteJob);

export default router;