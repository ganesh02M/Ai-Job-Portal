import { useEffect } from "react";
import useJobsStore from "../../store/jobsStore";
import JobCard from "../../components/jobs/JobCard";
import Loader from "../../components/common/Loader";
import JobFilters from "./JobFilters";

export default function JobListing() {
  const { jobs, loading, total, fetchJobs } = useJobsStore();

  useEffect(() => {
    fetchJobs(1);
  }, []);

  return (
    <div className="max-w-6xl mx-auto px-6 py-10 grid grid-cols-1 md:grid-cols-[280px_1fr] gap-6">
      <aside>
        <JobFilters />
      </aside>

      <main>
        <h1 className="text-2xl font-bold text-ink-900 mb-1">
          {total} Jobs For You
        </h1>
        <p className="text-ink-500 mb-6">Browse direct and external listings, matched to your resume.</p>

        {loading ? (
          <Loader />
        ) : (
          <div className="space-y-4">
            {jobs.length === 0 && (
              <p className="text-ink-500">No jobs match your filters yet.</p>
            )}
            {jobs.map((job) => (
              <JobCard key={job._id} job={job} />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
