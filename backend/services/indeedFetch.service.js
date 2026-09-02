// Fetches live jobs and upserts them into the Job collection as source: "external".
// NOTE: Wire this to the actual Indeed API/connector response shape once you
// confirm the exact fields it returns (title, company, location, url, jobId, etc.)

import Job from "../models/Job.js";

/**
 * @param {Object} params
 * @param {string} params.keyword   e.g. "MERN Developer"
 * @param {string} params.location  e.g. "India" or a city
 * @param {number} params.limit     how many jobs to fetch per sync
 */
async function syncIndeedJobs({ keyword = "software developer", location = "India", limit = 20 } = {}) {
  // TODO: replace with actual Indeed API call (search_jobs / get_job_details tools)
  const fetchedJobs = await fetchFromIndeedAPI({ keyword, location, limit });

  let created = 0;
  let updated = 0;

  for (const j of fetchedJobs) {
    const result = await Job.findOneAndUpdate(
      { externalJobId: j.externalJobId },
      {
        title: j.title,
        company: j.company,
        description: j.description,
        location: j.location,
        salaryMin: j.salaryMin,
        salaryMax: j.salaryMax,
        jobType: j.jobType || "full-time",
        experienceLevel: j.experienceLevel || "fresher",
        skillsRequired: j.skillsRequired || [],
        source: "external",
        externalApplyUrl: j.applyUrl,
        externalJobId: j.externalJobId,
        isActive: true,
      },
      { upsert: true, new: true, rawResult: true }
    );

    if (result.lastErrorObject?.updatedExisting) {
      updated++;
    } else {
      created++;
    }
  }

  console.log(`Indeed sync done: ${created} created, ${updated} updated`);
  return { created, updated };
}

// Placeholder — swap this out for the real Indeed connector/API call.
async function fetchFromIndeedAPI({ keyword, location, limit }) {
  console.warn(
    "fetchFromIndeedAPI is a stub — wire it to the real Indeed API before running syncIndeedJobs()"
  );
  return [];
}

export { syncIndeedJobs };