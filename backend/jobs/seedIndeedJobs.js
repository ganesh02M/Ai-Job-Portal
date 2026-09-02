// Run manually with: node jobs/seedIndeedJobs.js
// This is a one-time seed using real job listings fetched from Indeed
// (via Claude's Indeed connector). For ongoing syncing later, use a
// proper sync route with fresh data.

import dotenv from "dotenv";
import connectDB from "../config/db.js";
import Job from "../models/Job.js";

dotenv.config();

const jobs = [
  {
    externalJobId: "INDEED_JOBSEARCH_22",
    title: "MERN Stack Developer",
    company: "smTechPartner",
    location: "Remote",
    description:
      "MERN Stack Developer role — building and maintaining web applications using MongoDB, Express.js, React.js, and Node.js.",
    jobType: "full-time",
    experienceLevel: "1-3",
    skillsRequired: ["MongoDB", "Express.js", "React.js", "Node.js"],
    externalApplyUrl: "https://to.indeed.com/aahhcmrtsrmg",
  },
  {
    externalJobId: "INDEED_JOBSEARCH_27",
    title: "Senior Full Stack Developer (MERN Stack) – Remote",
    company: "Enfec",
    location: "Remote",
    description:
      "Senior Full Stack Developer (MERN Stack) with 8+ years of experience. Design, develop, and maintain scalable web applications using MongoDB, Express.js, React.js, and Node.js. Build responsive UIs, develop secure RESTful APIs, ensure performance and security best practices, conduct code reviews, work with CI/CD pipelines and cloud deployments (AWS, Azure, or GCP). Requires strong JavaScript (ES6+), React.js, Node.js, Express.js, MongoDB, RESTful API development, HTML5/CSS3, Git, and remote collaboration experience.",
    jobType: "full-time",
    experienceLevel: "5+",
    skillsRequired: ["JavaScript", "React.js", "Node.js", "Express.js", "MongoDB", "REST API", "Git", "AWS"],
    externalApplyUrl: "https://to.indeed.com/aax4pn7r4msk",
  },
  {
    externalJobId: "INDEED_JOBSEARCH_29",
    title: "Full Stack Developer",
    company: "Waarta Connections Pvt Ltd",
    location: "Remote",
    description:
      "Full Stack Developer role working across frontend and backend web development.",
    jobType: "full-time",
    experienceLevel: "1-3",
    skillsRequired: ["React.js", "Node.js", "JavaScript"],
    externalApplyUrl: "https://to.indeed.com/aavkvvdkpqj4",
  },
  {
    externalJobId: "INDEED_JOBSEARCH_33",
    title: "Full Stack Developer Intern",
    company: "NEXASEC CYBER SOLUTION",
    location: "Remote",
    description:
      "Internship opportunity for a Full Stack Developer, working on real projects using modern web technologies.",
    jobType: "internship",
    experienceLevel: "fresher",
    skillsRequired: ["React.js", "Node.js", "JavaScript", "HTML", "CSS"],
    externalApplyUrl: "https://to.indeed.com/aaxgmpc7ppdg",
  },
  {
    externalJobId: "INDEED_JOBSEARCH_34",
    title: "React Native Developer Intern",
    company: "Particle14",
    location: "Remote",
    description:
      "Internship for a React Native Developer to work on cross-platform mobile applications.",
    jobType: "internship",
    experienceLevel: "fresher",
    skillsRequired: ["React Native", "JavaScript", "React.js"],
    externalApplyUrl: "https://to.indeed.com/aak2dpzc62vn",
  },
  {
    externalJobId: "INDEED_JOBSEARCH_37",
    title: "Jobs for React Native Trainee",
    company: "Creative Web Solutions",
    location: "Remote",
    description:
      "Trainee role for someone starting out with React Native mobile app development.",
    jobType: "full-time",
    experienceLevel: "fresher",
    skillsRequired: ["React Native", "JavaScript"],
    externalApplyUrl: "https://to.indeed.com/aa2hb4wdlqmk",
  },
];

(async () => {
  await connectDB();

  let created = 0;
  let updated = 0;

  for (const j of jobs) {
    const result = await Job.findOneAndUpdate(
      { externalJobId: j.externalJobId },
      { ...j, source: "external", isActive: true },
      { upsert: true, new: true, rawResult: true }
    );

    if (result.lastErrorObject?.updatedExisting) {
      updated++;
    } else {
      created++;
    }
  }

  console.log(`Seed complete: ${created} created, ${updated} updated`);
  process.exit(0);
})();