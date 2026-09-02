
// This controller doesn't duplicate logic — it re-exports the relevant
// functions from jobs.controller.js and applications.controller.js so the
// recruiter dashboard has one clean namespace: /api/recruiter/*

import { createJob, updateJob, deleteJob, getMyJobs } from "./jobs.controller.js";
import { getApplicantsForJob, updateApplicationStatus } from "./applications.controller.js";

export const postJob = createJob;
export { updateJob, deleteJob, getMyJobs, getApplicantsForJob, updateApplicationStatus };