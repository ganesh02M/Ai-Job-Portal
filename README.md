# AI-Powered Job Portal

A full-stack MERN job portal with built-in AI resume intelligence. Candidates get instant ATS scoring and JD-match checks against their resume; recruiters get applicants automatically ranked by match score. Built on top of [SmartHire-AI](https://github.com/ganesh02M/SmartHire-AI) (an AI resume analyzer), extended into a full job portal.

## Tech Stack

- **Frontend:** React + Vite + TailwindCSS + Zustand + React Router
- **Backend:** Node.js + Express + MongoDB (Mongoose) — **ES Modules** (`"type": "module"` in package.json)
- **AI:** Groq API (Llama models) — resume parsing, ATS scoring, JD matching, cover letter generation
- **Auth:** JWT (email/password) + Google OAuth
- **External jobs:** Indeed data (seeded via a one-time script; see below)

## Project Structure

```
backend/
  config/db.js              # MongoDB connection
  models/
    User.js                 # includes role: "candidate" | "recruiter"
    Resume.js                # rawText, parsedData (skills/experience/education), atsScore, jdMatch, coverLetter
    Job.js                    # source: "direct" (recruiter-posted) | "external" (Indeed)
    Application.js
    SavedJob.js
  controllers/
    authController.js         # registerUser, loginUser, getMe, googleLogin — all return { role }
    resumeController.js       # uploadResume, getResumeHistory, getResumeById, scoreResume,
                               #   matchJobDescription, generateCoverLetterForResume
                               #   (all AI logic lives here — no separate service files)
    jobs.controller.js        # CRUD + filtered listing for jobs
    applications.controller.js # apply, withdraw, save/unsave, recruiter's ranked applicant view
    recruiter.controller.js    # thin re-export wrapper for the recruiter dashboard namespace
    indeedSync.controller.js   # upserts external jobs from a provided jobs array
  middleware/
    authMiddleware.js          # exports `protect` (named export, not default!)
    role.middleware.js         # checkRole("recruiter") / checkRole("candidate")
    upload.js                  # multer memoryStorage, PDF/DOCX only, 5MB limit
    errorHandler.js            # notFound + errorHandler, mounted after all routes
  routes/
    authRoutes.js, resumeRoutes.js, jobs.routes.js,
    applications.routes.js, recruiter.routes.js, indeedSync.routes.js
  jobs/
    seedIndeedJobs.js          # one-time script, seeds real Indeed jobs fetched live
  server.js

frontend/
  src/
    pages/
      Login.jsx, Register.jsx        # includes candidate/recruiter role picker
      UploadResume.jsx, ResumeDetail.jsx, History.jsx, Dashboard.jsx  # SmartHire's resume tool, flat paths
      jobs/JobListing.jsx, JobDetail.jsx, JobFilters.jsx
      dashboard/DashboardHome.jsx, AppliedJobs.jsx, SavedJobs.jsx
      recruiter/PostJob.jsx, ManageJobs.jsx, ApplicantsList.jsx
    components/
      common/Navbar.jsx, ProtectedRoute.jsx, Loader.jsx
      jobs/JobCard.jsx (with save/bookmark star), MatchExplanation.jsx
      ResumeCard.jsx, ScoreGauge.jsx
    api/          # SmartHire's original: axios.js, authApi.js, resumeApi.js
    services/     # new: api.js (axios wrapper), jobsApi.js
    store/        # authStore.js (Zustand + persist: user, token, login, logout)
                  # resumeStore.js, jobsStore.js
    App.jsx       # wrapped in <GoogleOAuthProvider>
```

## Setup

```bash
# Backend
cd backend
npm install
cp .env.example .env   # fill in real values, see below
npm run dev

# Frontend (separate terminal)
cd frontend
npm install
npm run dev
```

### Backend `.env`
```
PORT=5000
MONGO_URI=<standard, non-SRV connection string — see note below>
JWT_SECRET=
JWT_EXPIRE=7d
CLIENT_URL=http://localhost:5173

GROQ_API_KEY=
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=
```

### Frontend `.env`
```
VITE_API_URL=http://localhost:5000/api
VITE_GOOGLE_CLIENT_ID=<same as backend GOOGLE_CLIENT_ID>
```

**MongoDB URI note:** If `mongodb+srv://` gives `querySrv ECONNREFUSED` (common on some Windows/antivirus setups), switch to the standard non-SRV format with explicit shard hosts:
```
mongodb://user:pass@shard-00-00.xxx.mongodb.net:27017,shard-00-01.xxx.mongodb.net:27017,shard-00-02.xxx.mongodb.net:27017/dbname?ssl=true&replicaSet=atlas-xxxxx-shard-0&authSource=admin&retryWrites=true&w=majority
```
Get the shard hostnames and replicaSet name via `nslookup -type=SRV` and `nslookup -type=TXT` on your cluster's SRV address.

**Cloudinary:** not actively used yet — resumes are parsed to text in memory (`multer.memoryStorage()`), the original file isn't stored anywhere. The env vars are there for a possible future "download original resume" feature.

## Key Fixes Applied (things that weren't obvious from SmartHire's original code)

1. **No `role` field existed anywhere** in SmartHire's `User.js`, `authController.js` (register/login/googleLogin). Added `role: "candidate" | "recruiter"` to the schema, all three response paths, and a role-picker UI in `Register.jsx`. Without this every user showed as a candidate regardless of what they picked at signup.
2. **`authMiddleware.js` exports `protect`** (named export) — not a default export. Route files must `import { protect } from "../middleware/authMiddleware.js"`.
3. **ES Modules throughout** — SmartHire's code uses `import`/`export`; anything written in CommonJS (`require`/`module.exports`) will crash with `[object Module]` errors. `package.json` has `"type": "module"`.
4. **Token retrieval bug** — `authStore.js` persists to `localStorage` under a Zustand-specific key, not a plain `"token"` key. The axios interceptor must read `useAuthStore.getState().token`, not `localStorage.getItem("token")`.
5. **No separate AI service files** — all Groq calls, ATS scoring, JD matching, and cover letter generation live directly inside `resumeController.js`. `matchJobDescription(resumeId, jobDescription)` is the function the jobs side calls for "Check My Match".
6. **ATS score is per-resume, not per-candidate** — a candidate can have multiple uploaded resumes; only the one actually tied to a given application matters for what the recruiter sees. If the recruiter's view shows no score, the candidate needs to run "Run ATS score" on that specific resume.

## Core Features

**Candidate:** register/login (email+password or Google), upload resume (PDF/DOCX, auto-parsed by AI), ATS score with feedback, paste any JD for a match % + missing keywords, browse jobs (own postings + real Indeed listings) with filters, one-click apply (auto-uses latest resume), save/bookmark jobs, track application status.

**Recruiter:** register/login, post jobs, view own posted jobs, see applicants **automatically ranked by match score**, expand any applicant to view their full resume breakdown (skills, experience, education, ATS score) without downloading a file.

## Real External Jobs (Indeed)

`backend/jobs/seedIndeedJobs.js` is a one-time script seeded with real job data (title, company, location, description, apply URL) fetched live from Indeed. Run once with:
```bash
node jobs/seedIndeedJobs.js
```
For ongoing syncing, `POST /api/indeed-sync` (`indeedSync.controller.js`) accepts a `jobs` array in the same shape and upserts by `externalJobId` — wire a fresh Indeed fetch to call this periodically if needed.

## Known Gaps / Future Work

- Cloudinary not wired to any actual upload flow yet
- Indeed sync is manual/one-time, not a live cron job
- No "download original resume" — only AI-extracted text/structured data is shown
- UI could use more visual polish, but every core flow (both roles, resume tools, job posting/apply/match) is fully working end-to-end