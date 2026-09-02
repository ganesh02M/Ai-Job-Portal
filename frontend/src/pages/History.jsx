import { useEffect, useState } from "react";
import { getResumeHistory } from "../api/resumeApi";
import ResumeCard from "../components/ResumeCard";

const History = () => {
  const [resumes, setResumes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getResumeHistory()
      .then(({ data }) => setResumes(data))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="max-w-4xl mx-auto px-6 py-10">
      <p className="font-mono text-xs text-accent tracking-widest mb-2 font-medium">
        HISTORY
      </p>
      <h1 className="font-display text-4xl font-bold text-ink mb-8">
        All analyses
      </h1>

      {loading ? (
        <p className="font-body text-sm text-ink-soft">Loading...</p>
      ) : resumes.length === 0 ? (
        <p className="font-body text-ink-soft">No resumes uploaded yet.</p>
      ) : (
        <div className="space-y-3">
          {resumes.map((r) => (
            <ResumeCard key={r._id} resume={r} />
          ))}
        </div>
      )}
    </div>
  );
};

export default History;