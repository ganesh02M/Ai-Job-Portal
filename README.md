

Readme · MD
# AI-Powered Job Portal
 
A full-stack MERN job portal with built-in AI resume intelligence. Candidates get instant ATS scoring and JD-match checks against their resume; recruiters get applicants automatically ranked by match score. Real job listings are pulled live from LinkedIn, Indeed, Glassdoor, and ZipRecruiter via the JSearch API.
 
**Live site:** https://ai-job-portal-puce.vercel.app
**Backend API:** https://ai-job-portal-cbqw.onrender.com
 
## Tech Stack
 
- **Frontend:** React + Vite + TailwindCSS + Zustand + React Router
- **Backend:** Node.js + Express + MongoDB (Mongoose) — ES Modules
- **AI:** Groq API (Llama models) — resume parsing, ATS scoring, JD matching, cover letter generation
- **Auth:** JWT (email/password) + Google OAuth
- **Real job data:** JSearch API (RapidAPI) — live search across LinkedIn, Indeed, Glassdoor, ZipRecruiter
- **Deployment:** Vercel (frontend) + Render (backend)
## Project Structure
 
```
backend/
  config/db.js              # MongoDB connection
  models/
    User.js                 # includes role: "candidate" | "recruiter"
    Resume.js                # rawText, parsedData (skills/experience/education), atsScore, jdMatch, coverLetter
    Job.js                    # source: "direct" (recruiter-posted) | "external" (JSearch)
    Application.js
    SavedJob.js
  controllers/
    authController.js         # registerUser, loginUser, getMe, googleLogin — all return { role }
    resumeController.js       # uploadResume, getResumeHistory, getResumeById, scoreResume,
                               #   matchJobDescription, generateCoverLetterForResume
                               #   (all AI logic lives here — no separate service files)
    jobs.controller.js        # CRUD + filtered listing; live-fetches from JSearch on keyword search
    applications.controller.js # apply, withdraw, save/unsave, recruiter's ranked applicant view
    recruiter.controller.js    # thin re-export wrapper for the recruiter dashboard namespace
  services/
    jsearch.service.js         # calls JSearch API, normalizes results to the Job schema shape
  middleware/
    authMiddleware.js          # exports `protect` (named export, not default!)
    role.middleware.js         # checkRole("recruiter") / checkRole("candidate")
    upload.js                  # multer memoryStorage, PDF/DOCX only, 5MB limit
    errorHandler.js            # notFound + errorHandler, mounted after all routes
  routes/
    authRoutes.js, resumeRoutes.js, jobs.routes.js,
    applications.routes.js, recruiter.routes.js
  server.js
 
frontend/
  src/
    pages/
      Login.jsx, Register.jsx        # includes candidate/recruiter role picker
      UploadResume.jsx, ResumeDetail.jsx, History.jsx, Dashboard.jsx  # resume tool pages
      jobs/JobListing.jsx, JobDetail.jsx, JobFilters.jsx
      dashboard/DashboardHome.jsx, AppliedJobs.jsx, SavedJobs.jsx
      recruiter/PostJob.jsx, ManageJobs.jsx, ApplicantsList.jsx
    components/
      common/Navbar.jsx, ProtectedRoute.jsx, Loader.jsx
      jobs/JobCard.jsx (with save/bookmark star), MatchExplanation.jsx
      ResumeCard.jsx, ScoreGauge.jsx
    api/          # axios.js, authApi.js, resumeApi.js
    services/     # api.js (axios wrapper), jobsApi.js
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
JSEARCH_API_KEY=
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
 
**JSearch API:** free tier on RapidAPI (200 requests/month). Subscribe to the "Basic" plan on the JSearch API page, then copy the key. **Endpoint is `/search-v2`, not `/search`** — the older endpoint 404s. Response data is nested at `response.data.data.jobs`.
 
**Cloudinary:** not actively used yet — resumes are parsed to text in memory (`multer.memoryStorage()`), the original file isn't stored anywhere. The env vars are there for a possible future "download original resume" feature.
 
## Key Implementation Notes
 
1. **Role-based access** — `User.js` has `role: "candidate" | "recruiter"`, set at registration via a role-picker UI, returned in every auth response (register/login/googleLogin), and enforced on protected routes via `role.middleware.js`.
2. **`authMiddleware.js` exports `protect`** (named export) — route files import it as `import { protect } from "../middleware/authMiddleware.js"`.
3. **ES Modules throughout** — everything uses `import`/`export`, no CommonJS. `package.json` has `"type": "module"`.
4. **Token retrieval** — `authStore.js` persists auth state to `localStorage` via Zustand's `persist` middleware. The axios interceptor reads the token with `useAuthStore.getState().token`, not a raw `localStorage.getItem("token")`.
5. **AI logic lives in `resumeController.js`** — all Groq calls, ATS scoring, JD matching, and cover letter generation are handled directly in this one controller. `matchJobDescription(resumeId, jobDescription)` is what the jobs side calls for "Check My Match".
6. **ATS score is per-resume, not per-candidate** — a candidate can have multiple uploaded resumes; only the one actually tied to a given application matters for what the recruiter sees.
7. **Real job listings are live, not cached one-time data** — every keyword search on `/jobs` triggers a fresh JSearch API call, and results are upserted into MongoDB (deduped by `externalJobId`) so applying/saving still works normally on external listings.
## Core Features
 
**Candidate:** register/login (email+password or Google), upload resume (PDF/DOCX, auto-parsed by AI), ATS score with feedback, paste any JD for a match % + missing keywords, browse jobs (own postings + live external listings) with filters, one-click apply (auto-uses latest resume), save/bookmark jobs, track application status.
 
**Recruiter:** register/login, post jobs, view own posted jobs, see applicants **automatically ranked by match score**, expand any applicant to view their full resume breakdown (skills, experience, education, ATS score) without downloading a file.
 
## Deployment
 
- **Frontend:** Vercel, root directory `frontend`, framework auto-detected as Vite. `VITE_GOOGLE_CLIENT_ID` must be set as type **Config** (not Secret) — Vercel blocks `VITE_`-prefixed vars marked Secret from reaching the browser bundle, which breaks Google Sign-In since the client ID needs to be public.
- **Backend:** Render, root directory `backend`, build `npm install`, start `node server.js`, free web service tier. `CLIENT_URL` must exactly match the frontend's live URL (including `.app`) or CORS will silently block every request.
## Known Gaps / Future Work
 
- Cloudinary not wired to any actual upload flow yet
- No "download original resume" — only AI-extracted text/structured data is shown
- UI could use more visual polish, but every core flow (both roles, resume tools, job posting/apply/match, live job search) is fully working end-to-end
## Author
 
**Ganesh Mishra**
 
- 📧 [mishraganesh9305@gmail.com](mailto:mishraganesh9305@gmail.com)
- 🔗 [GitHub](https://github.com/ganesh02M)
- 💼 [LinkedIn](https://linkedin.com/in/ganesh-mishra-6baa9828b)
- 💻 [LeetCode](https://leetcode.com/u/Ganesh9305)
 
