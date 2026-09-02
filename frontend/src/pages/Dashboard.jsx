import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getResumeHistory } from "../api/resumeApi";
import { useAuthStore } from "../store/authStore";
import ResumeCard from "../components/ResumeCard";

const Dashboard = () => {
  const { user } = useAuthStore();
  const [resumes, setResumes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getResumeHistory()
      .then(({ data }) => setResumes(data))
      .finally(() => setLoading(false));
  }, []);

  const latest = resumes[0];

  return (
    <div className="max-w-5xl mx-auto px-6 py-10">
      <p className="font-mono text-xs text-accent tracking-widest mb-2 font-medium">
        DASHBOARD
      </p>
      <h1 className="font-display text-4xl font-bold text-ink mb-2">
        Welcome, {user?.name?.split(" ")[0]}
      </h1>
      <p className="text-ink-soft font-body mb-10">
        Track your resume performance across analyses.
      </p>

      {loading ? (
        <p className="font-body text-sm text-ink-soft">Loading...</p>
      ) : resumes.length === 0 ? (
        <div className="bg-surface rounded-3xl border border-line p-12 text-center">
          <p className="font-body text-ink-soft mb-5">
            No resumes analyzed yet.
          </p>
          <Link
            to="/upload"
            className="inline-block bg-accent text-white font-body font-semibold px-6 py-3 rounded-full hover:opacity-90 shadow-lg shadow-accent/25"
          >
            Upload your first resume
          </Link>
        </div>
      ) : (
        <>
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-body text-sm font-semibold text-ink-soft">
              Most recent
            </h2>
            <Link
              to="/upload"
              className="font-body text-sm text-accent font-medium hover:underline"
            >
              + New analysis
            </Link>
          </div>
          <ResumeCard resume={latest} />

          {resumes.length > 1 && (
            <div className="mt-8">
              <Link
                to="/history"
                className="font-body text-sm text-ink-soft hover:text-accent"
              >
                View all {resumes.length} analyses →
              </Link>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default Dashboard;