import axios from "axios";

const RAPIDAPI_HOST = "jsearch.p.rapidapi.com";

/**
 * Fetches live jobs from JSearch (RapidAPI) and normalizes them
 .
 */
export async function fetchJSearchJobs({ query, numPages = 1 } = {}) {
  if (!process.env.JSEARCH_API_KEY) {
    console.warn("JSEARCH_API_KEY not set — skipping live job search");
    return [];
  }
  if (!query || !query.trim()) return [];

  try {
    const response = await axios.get("https://jsearch.p.rapidapi.com/search-v2", {
     params: {
  query,
  page: "1",
  num_pages: String(numPages),
  country: "in",
  date_posted: "all",
},
      headers: {
        "x-rapidapi-host": RAPIDAPI_HOST,
        "x-rapidapi-key": process.env.JSEARCH_API_KEY,
      },
      timeout: 8000,
    });
    
    const jobs = response.data?.data?.jobs || [];

    return jobs.map((j) => ({
      externalJobId: `JSEARCH_${j.job_id}`,
      title: j.job_title,
      company: j.employer_name || "Unknown Company",
      location:
        [j.job_city, j.job_state, j.job_country].filter(Boolean).join(", ") ||
        (j.job_is_remote ? "Remote" : "Not specified"),
      description: j.job_description || "No description provided.",
      jobType: mapJobType(j.job_employment_type),
      experienceLevel: "fresher",
      skillsRequired: j.job_required_skills || [],
      externalApplyUrl: j.job_apply_link,
      salaryMin: j.job_min_salary || undefined,
      salaryMax: j.job_max_salary || undefined,
    }));
 } catch (err) {
  console.error("fetchJSearchJobs error:", err.message);
  console.error("fetchJSearchJobs response data:", JSON.stringify(err.response?.data));
  console.error("fetchJSearchJobs status:", err.response?.status);
  return [];
}
}

function mapJobType(raw = "") {
  const t = (raw || "").toLowerCase();
  if (t.includes("intern")) return "internship";
  if (t.includes("part")) return "part-time";
  if (t.includes("contract")) return "contract";
  return "full-time";
}