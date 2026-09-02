import Resume from "../models/Resume.js";
import { extractText } from "../utils/parseFile.js";
import { extractResumeData } from "../utils/groqClient.js";
import { calculateATSScore } from "../utils/atsScorer.js";
import { matchResumeToJD } from "../utils/groqClient.js";
import { generateCoverLetter } from "../utils/groqClient.js";

export const uploadResume = async (req, res, next) => {
  try {
    if (!req.file) {
      res.status(400);
      throw new Error("Please upload a file");
    }

    const rawText = await extractText(req.file);
    const parsedData = await extractResumeData(rawText);

    const resume = await Resume.create({
      user: req.user._id,
      fileName: req.file.originalname,
      rawText,
      parsedData,
    });

    res.status(201).json(resume);
  } catch (error) {
    next(error);
  }
};

export const getResumeHistory = async (req, res, next) => {
  try {
    const resumes = await Resume.find({ user: req.user._id })
      .select("-rawText")
      .sort({ createdAt: -1 });
    res.json(resumes);
  } catch (error) {
    next(error);
  }
};

export const getResumeById = async (req, res, next) => {
  try {
    const resume = await Resume.findOne({
      _id: req.params.id,
      user: req.user._id,
    });
    if (!resume) {
      res.status(404);
      throw new Error("Resume not found");
    }
    res.json(resume);
  } catch (error) {
    next(error);
  }
};
export const scoreResume = async (req, res, next) => {
  try {
    const resume = await Resume.findOne({
      _id: req.params.id,
      user: req.user._id,
    });
    if (!resume) {
      res.status(404);
      throw new Error("Resume not found");
    }

    const { atsScore, atsFeedback, suggestions } = await calculateATSScore(
      resume.rawText
    );

    resume.atsScore = atsScore;
    resume.atsFeedback = atsFeedback;
    await resume.save();

    res.json({ atsScore, atsFeedback, suggestions });
  } catch (error) {
    next(error);
  }
};

export const matchJobDescription = async (req, res, next) => {
  try {
    console.log("DEBUG req.body:", req.body);
    const { jobDescription } = req.body;

    if (!jobDescription || jobDescription.trim().length < 20) {
      res.status(400);
      throw new Error("Please provide a valid job description");
    }

    const resume = await Resume.findOne({
      _id: req.params.id,
      user: req.user._id,
    });
    if (!resume) {
      res.status(404);
      throw new Error("Resume not found");
    }

    const matchResult = await matchResumeToJD(resume.rawText, jobDescription);

    resume.jdMatch = {
      jobDescription,
      matchPercent: matchResult.matchPercent,
      missingKeywords: matchResult.missingKeywords,
      suggestions: matchResult.suggestions,
    };
    await resume.save();

    res.json({
      matchPercent: matchResult.matchPercent,
      matchingSkills: matchResult.matchingSkills,
      missingKeywords: matchResult.missingKeywords,
      suggestions: matchResult.suggestions,
    });
  } catch (error) {
    next(error);
  }
};

export const generateCoverLetterForResume = async (req, res, next) => {
  try {
    const { jobDescription } = req.body;

    if (!jobDescription || jobDescription.trim().length < 20) {
      res.status(400);
      throw new Error("Please provide a valid job description");
    }

    const resume = await Resume.findOne({
      _id: req.params.id,
      user: req.user._id,
    });
    if (!resume) {
      res.status(404);
      throw new Error("Resume not found");
    }

    const { coverLetter } = await generateCoverLetter(
      resume.rawText,
      jobDescription,
      req.user.name
    );

    resume.coverLetter = coverLetter;
    await resume.save();

    res.json({ coverLetter });
  } catch (error) {
    next(error);
  }
};