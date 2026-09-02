import { useEffect, useState } from "react";
import { getSavedJobs } from "../../services/jobsApi";
import JobCard from "../../components/jobs/JobCard";
import Loader from "../../components/common/Loader";

export default function SavedJobs() {
  const [saved, setSaved] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getSavedJobs()
      .then((res) => setSaved(res.data))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <Loader />;

  return (
    <div className="max-w-3xl mx-auto px-6 py-10">
      <h1 className="text-2xl font-bold text-ink-900 mb-6">Saved Jobs</h1>
      <div className="space-y-4">
        {saved.length === 0 && <p className="text-ink-500">No saved jobs yet.</p>}
        {saved.map((s) => (
          <JobCard key={s._id} job={s.job} />
        ))}
      </div>
    </div>
  );
}
