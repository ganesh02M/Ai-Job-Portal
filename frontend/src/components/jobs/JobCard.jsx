import { useState } from "react";
import { Link } from "react-router-dom";
import { saveJob, unsaveJob } from "../../services/jobsApi";

export default function JobCard({ job, matchScore }) {
  const [saved, setSaved] = useState(false);
  const [saving, setSaving] = useState(false);

  const salaryText =
    job.salaryMin && job.salaryMax
      ? `₹${(job.salaryMin / 100000).toFixed(1)}L - ₹${(job.salaryMax / 100000).toFixed(1)}L`
      : "Salary not disclosed";

  const handleSaveToggle = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    setSaving(true);
    try {
      if (saved) {
        await unsaveJob(job._id);
        setSaved(false);
      } else {
        await saveJob(job._id);
        setSaved(true);
      }
    } catch (err) {
      // 409 means already saved/unsaved on backend — just sync UI state
      setSaved(!saved);
    } finally {
      setSaving(false);
    }
  };

  return (
    <Link
      to={`/jobs/${job._id}`}
      className="block bg-white border border-slate-100 rounded-xl p-5 hover:shadow-md transition-shadow relative"
    >
      <button
        onClick={handleSaveToggle}
        disabled={saving}
        className="absolute top-4 right-4 text-lg"
        title={saved ? "Unsave job" : "Save job"}
      >
        {saved ? "★" : "☆"}
      </button>

      <div className="flex justify-between items-start pr-8">
        <div>
          <h3 className="font-semibold text-ink-900">{job.title}</h3>
          <p className="text-sm text-ink-500">{job.company} · {job.location}</p>
        </div>

        {matchScore != null && (
          <span className="bg-accent-500/10 text-accent-600 text-xs font-semibold px-3 py-1 rounded-full">
            {matchScore}% match
          </span>
        )}
      </div>

      <div className="flex flex-wrap gap-2 mt-3">
        {(job.skillsRequired || []).slice(0, 4).map((skill) => (
          <span
            key={skill}
            className="bg-primary-50 text-primary-700 text-xs px-2 py-1 rounded-md"
          >
            {skill}
          </span>
        ))}
      </div>

      <div className="flex justify-between items-center mt-4 text-sm">
        <span className="text-ink-500">{salaryText}</span>
        <span className="text-xs uppercase tracking-wide text-ink-500">
          {job.source === "external" ? "External" : "Direct Apply"}
        </span>
      </div>
    </Link>
  );
}