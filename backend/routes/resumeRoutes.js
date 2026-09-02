import express from "express";
import {
  uploadResume,
  getResumeHistory,
  getResumeById,
  scoreResume,
  matchJobDescription,
  generateCoverLetterForResume,
} from "../controllers/resumeController.js";
import { protect } from "../middleware/authMiddleware.js";
import upload from "../middleware/upload.js";

const router = express.Router();

router.post("/upload", protect, upload.single("resume"), uploadResume);
router.get("/history", protect, getResumeHistory);
router.get("/:id", protect, getResumeById);
router.post("/:id/score", protect, scoreResume);
router.post("/:id/match", protect, matchJobDescription);
router.post("/:id/cover-letter", protect, generateCoverLetterForResume);

export default router;