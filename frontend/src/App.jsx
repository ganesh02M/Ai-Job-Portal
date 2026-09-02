import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./components/common/Navbar";
import ProtectedRoute from "./components/common/ProtectedRoute";
import { GoogleOAuthProvider } from "@react-oauth/google";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";

// SmartHire's resume-tool pages (kept at their real, flat SmartHire names)
import UploadResume from "./pages/UploadResume";
import ResumeDetail from "./pages/ResumeDetail";
import ResumeHistory from "./pages/History";
import ResumeDashboard from "./pages/Dashboard"; // SmartHire's own resume dashboard — different from the job portal's candidate dashboard below

import JobListing from "./pages/jobs/JobListing";
import JobDetail from "./pages/jobs/JobDetail";

import DashboardHome from "./pages/dashboard/DashboardHome";
import AppliedJobs from "./pages/dashboard/AppliedJobs";
import SavedJobs from "./pages/dashboard/SavedJobs";

import PostJob from "./pages/recruiter/PostJob";
import ManageJobs from "./pages/recruiter/ManageJobs";
import ApplicantsList from "./pages/recruiter/ApplicantsList";

export default function App() {
  return (
    <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
      <BrowserRouter>
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Resume Check — standalone section (from SmartHire), usable without job search */}
          <Route path="/resume-check" element={<UploadResume />} />
          <Route path="/resume/:id" element={<ResumeDetail />} />
          <Route path="/resume-check/history" element={<ResumeHistory />} />
          <Route path="/resume-check/dashboard" element={<ResumeDashboard />} />

          {/* Jobs — Indeed-style browsing (new) */}
          <Route path="/jobs" element={<JobListing />} />
          <Route path="/jobs/:id" element={<JobDetail />} />

          {/* Candidate dashboard (new — job applications/saved, separate from resume dashboard above) */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute allowedRoles={["candidate"]}>
                <DashboardHome />
              </ProtectedRoute>
            }
          />
          <Route
            path="/dashboard/applied"
            element={
              <ProtectedRoute allowedRoles={["candidate"]}>
                <AppliedJobs />
              </ProtectedRoute>
            }
          />
          <Route
            path="/dashboard/saved"
            element={
              <ProtectedRoute allowedRoles={["candidate"]}>
                <SavedJobs />
              </ProtectedRoute>
            }
          />

          {/* Recruiter panel (new) */}
          <Route
            path="/recruiter/post-job"
            element={
              <ProtectedRoute allowedRoles={["recruiter"]}>
                <PostJob />
              </ProtectedRoute>
            }
          />
          <Route
            path="/recruiter/manage-jobs"
            element={
              <ProtectedRoute allowedRoles={["recruiter"]}>
                <ManageJobs />
              </ProtectedRoute>
            }
          />
          <Route
            path="/recruiter/jobs/:jobId/applicants"
            element={
              <ProtectedRoute allowedRoles={["recruiter"]}>
                <ApplicantsList />
              </ProtectedRoute>
            }
          />
        </Routes>
      </BrowserRouter>
    </GoogleOAuthProvider>
  );
}