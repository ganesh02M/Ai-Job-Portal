import useJobsStore from "../../store/jobsStore";

const jobTypes = ["full-time", "part-time", "internship", "remote", "contract"];
const experienceLevels = ["fresher", "0-1", "1-3", "3-5", "5+"];

export default function JobFilters() {
  const { filters, setFilters, fetchJobs } = useJobsStore();

  const handleChange = (key, value) => {
    setFilters({ [key]: value });
  };

  const handleSearch = () => fetchJobs(1);

  return (
    <div className="bg-white border border-slate-100 rounded-xl p-5 space-y-4">
      <input
        type="text"
        placeholder="Job title or skill"
        value={filters.keyword}
        onChange={(e) => handleChange("keyword", e.target.value)}
        className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm"
      />
      <input
        type="text"
        placeholder="Location"
        value={filters.location}
        onChange={(e) => handleChange("location", e.target.value)}
        className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm"
      />

      <select
        value={filters.jobType}
        onChange={(e) => handleChange("jobType", e.target.value)}
        className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm"
      >
        <option value="">Any job type</option>
        {jobTypes.map((t) => (
          <option key={t} value={t}>{t}</option>
        ))}
      </select>

      <select
        value={filters.experienceLevel}
        onChange={(e) => handleChange("experienceLevel", e.target.value)}
        className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm"
      >
        <option value="">Any experience</option>
        {experienceLevels.map((e) => (
          <option key={e} value={e}>{e}</option>
        ))}
      </select>

      <button
        onClick={handleSearch}
        className="w-full bg-primary-600 text-white py-2 rounded-lg font-medium hover:bg-primary-700"
      >
        Apply Filters
      </button>
    </div>
  );
}
