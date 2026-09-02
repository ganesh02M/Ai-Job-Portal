import { useEffect, useState } from "react";
import { getMyApplications } from "../../services/jobsApi";
import Loader from "../../components/common/Loader";

export default function AppliedJobs() {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getMyApplications()
      .then((res) => setApplications(res.data))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <Loader />;

  return (
    <div className="max-w-3xl mx-auto px-6 py-10">
      <h1 className="text-2xl font-bold text-ink-900 mb-6">Applied Jobs</h1>
      <div className="space-y-3">
        {applications.length === 0 && <p className="text-ink-500">You haven't applied to any jobs yet.</p>}
        {applications.map((app) => (
          <div key={app._id} className="bg-white border border-slate-100 rounded-xl p-4 flex justify-between items-center">
            <div>
              <p className="font-semibold text-ink-900">{app.job?.title}</p>
              <p className="text-sm text-ink-500">{app.job?.company}</p>
            </div>
            <span className="text-xs font-medium uppercase text-primary-700 bg-primary-50 px-3 py-1 rounded-full">
              {app.status}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
