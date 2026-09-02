// Run manually with: node jobs/syncIndeedJobs.cron.js
// Or schedule with node-cron / a hosted cron job (Render Cron Jobs, GitHub Actions, etc.)

import dotenv from "dotenv";
import connectDB from "../config/db.js";
import { syncIndeedJobs } from "../services/indeedFetch.service.js";

dotenv.config();

(async () => {
  await connectDB();

  await syncIndeedJobs({ keyword: "MERN developer", location: "India", limit: 20 });
  await syncIndeedJobs({ keyword: "SDE fresher", location: "India", limit: 20 });

  process.exit(0);
})();