import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getApplicantsForJob, updateApplicationStatus } from "../../services/jobsApi";
import Loader from "../../components/common/Loader";

export default function ApplicantsList() {
  const { jobId } = useParams();
  const [applicants, setApplicants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState(null);

  const load = () => {
    setLoading(true);
    getApplicantsForJob(jobId)
      .then((res) => setApplicants(res.data))
      .finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, [jobId]);

  const handleStatusChange = async (id, status) => {
    await updateApplicationStatus(id, status);
    load();
  };

  const toggleExpand = (id) => {
    setExpandedId(expandedId === id ? null : id);
  };

  if (loading) return <Loader />;

  return (
    <div className="max-w-3xl mx-auto px-6 py-10">
      <h1 className="text-2xl font-bold text-ink-900 mb-6">Applicants (ranked by match)</h1>

      <div className="space-y-3">
        {applicants.length === 0 && <p className="text-ink-500">No applicants yet.</p>}
        {applicants.map((app) => (
          <div key={app._id} className="bg-white border border-slate-100 rounded-xl p-4">
            <div className="flex justify-between items-center">
              <div>
                <p className="font-semibold text-ink-900">{app.candidate?.name}</p>
                <p className="text-sm text-ink-500">{app.candidate?.email}</p>
              </div>
              <div className="flex items-center gap-3">
                {app.matchScore != null && (
                  <span className="bg-accent-500/10 text-accent-600 text-xs font-semibold px-3 py-1 rounded-full">
                    {app.matchScore}% match
                  </span>
                )}
                <select
                  value={app.status}
                  onChange={(e) => handleStatusChange(app._id, e.target.value)}
                  className="border border-slate-200 rounded-lg px-2 py-1 text-sm"
                >
                  {["applied", "shortlisted", "rejected", "hired"].map((s) => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
                <button
                  onClick={() => toggleExpand(app._id)}
                  className="text-primary-600 text-sm font-medium hover:underline"
                >
                  {expandedId === app._id ? "Hide Resume" : "View Resume"}
                </button>
              </div>
            </div>

            {expandedId === app._id && app.resume && (
              <div className="mt-4 pt-4 border-t border-slate-100 space-y-3">
                <div className="flex items-center gap-3">
                  <p className="text-sm text-ink-500">{app.resume.fileName}</p>
                  {app.resume.atsScore != null && (
                    <span className="text-xs font-semibold text-primary-700 bg-primary-50 px-2 py-1 rounded-full">
                      ATS Score: {app.resume.atsScore}/100
                    </span>
                  )}
                </div>

                {app.resume.parsedData?.skills?.length > 0 && (
                  <div>
                    <p className="text-xs font-semibold text-ink-500 uppercase mb-1">Skills</p>
                    <div className="flex flex-wrap gap-2">
                      {app.resume.parsedData.skills.map((skill, i) => (
                        <span key={i} className="bg-primary-50 text-primary-700 text-xs px-2 py-1 rounded-md">
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {app.resume.parsedData?.experience?.length > 0 && (
                  <div>
                    <p className="text-xs font-semibold text-ink-500 uppercase mb-1">Experience</p>
                    <ul className="text-sm text-ink-900 space-y-1 list-disc list-inside">
                      {app.resume.parsedData.experience.map((exp, i) => (
                        <li key={i}>{exp}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {app.resume.parsedData?.education?.length > 0 && (
                  <div>
                    <p className="text-xs font-semibold text-ink-500 uppercase mb-1">Education</p>
                    <ul className="text-sm text-ink-900 space-y-1 list-disc list-inside">
                      {app.resume.parsedData.education.map((edu, i) => (
                        <li key={i}>{edu}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}