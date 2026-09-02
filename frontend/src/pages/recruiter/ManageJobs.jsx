import { useEffect, useState } from "react";
import { getMyPostedJobs, deleteJob } from "../../services/jobsApi";
import { Link } from "react-router-dom";
import Loader from "../../components/common/Loader";

export default function ManageJobs() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = () => {
    setLoading(true);
    getMyPostedJobs()
      .then((res) => setJobs(res.data))
      .finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  const handleDelete = async (id) => {
    await deleteJob(id);
    load();
  };

  if (loading) return <Loader />;

  return (
    <div className="max-w-4xl mx-auto px-6 py-10">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-ink-900">Your Posted Jobs</h1>
        <Link to="/recruiter/post-job" className="bg-primary-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-primary-700">
          + Post New Job
        </Link>
      </div>

      <div className="space-y-3">
        {jobs.map((job) => (
          <div key={job._id} className="bg-white border border-slate-100 rounded-xl p-4 flex justify-between items-center">
            <div>
              <p className="font-semibold text-ink-900">{job.title}</p>
              <p className="text-sm text-ink-500">{job.location}</p>
            </div>
            <div className="flex gap-3 text-sm">
              <Link to={`/recruiter/jobs/${job._id}/applicants`} className="text-primary-600 font-medium">
                View Applicants
              </Link>
              <button onClick={() => handleDelete(job._id)} className="text-red-500 font-medium">
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
