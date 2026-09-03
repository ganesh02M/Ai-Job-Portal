import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getJobById, applyToJob } from "../../services/jobsApi";
import { getResumeHistory } from "../../api/resumeApi";
import MatchExplanation from "../../components/jobs/MatchExplanation";
import Loader from "../../components/common/Loader";
import { matchJobDescription } from "../../api/resumeApi";

export default function JobDetail() {
  const { id } = useParams();
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [matchResult, setMatchResult] = useState(null);
  const [checkingMatch, setCheckingMatch] = useState(false);
  const [applying, setApplying] = useState(false);
  const [applyMessage, setApplyMessage] = useState("");

  useEffect(() => {
    getJobById(id)
      .then((res) => setJob(res.data))
      .finally(() => setLoading(false));
  }, [id]);

  const handleApply = async () => {
    setApplying(true);
    setApplyMessage("");
    try {
      const { data: resumes } = await getResumeHistory();
      if (!resumes || resumes.length === 0) {
        setApplyMessage("Please upload a resume first before applying.");
        return;
      }
      const latestResumeId = resumes[0]._id;
      await applyToJob(job._id, latestResumeId);
      setApplyMessage("Applied successfully!");
    } catch (err) {
      setApplyMessage(err.response?.data?.message || "Failed to apply.");
    } finally {
      setApplying(false);
    }
  };

 const handleCheckMatch = async () => {
  setCheckingMatch(true);
  try {
    const { data: resumes } = await getResumeHistory();
    if (!resumes || resumes.length === 0) {
      setApplyMessage("Please upload a resume first to check your match.");
      return;
    }
    const latestResumeId = resumes[0]._id;

    const { data } = await matchJobDescription(latestResumeId, job.description);
    setMatchResult({
      matchScore: data.matchPercent,
      missingKeywords: data.missingKeywords || [],
    });
  } catch (err) {
    setApplyMessage(err.response?.data?.message || "Failed to check match.");
  } finally {
    setCheckingMatch(false);
  }
};

  if (loading) return <Loader />;
  if (!job) return <p className="text-center py-12 text-ink-500">Job not found.</p>;

  return (
    <div className="max-w-3xl mx-auto px-6 py-10">
      <h1 className="text-2xl font-bold text-ink-900">{job.title}</h1>
      <p className="text-ink-500 mt-1">{job.company} · {job.location}</p>

      <div className="flex gap-3 mt-6">
        {job.source === "external" ? (
          <a
         
  href={job.externalApplyUrl}
  target="_blank"
  rel="noreferrer"
  className="bg-primary-600 text-white px-5 py-2 rounded-lg font-medium hover:bg-primary-700"
>
  Apply on External Site
</a>
        ) : (
          <button
            onClick={handleApply}
            disabled={applying}
            className="bg-primary-600 text-white px-5 py-2 rounded-lg font-medium hover:bg-primary-700 disabled:opacity-50"
          >
            {applying ? "Applying..." : "Apply Directly"}
          </button>
        )}

        <button
          onClick={handleCheckMatch}
          disabled={checkingMatch}
          className="border border-accent-500 text-accent-600 px-5 py-2 rounded-lg font-medium hover:bg-accent-500/5"
        >
          {checkingMatch ? "Checking..." : "Check My Match"}
        </button>
      </div>

      {applyMessage && (
        <p className="mt-3 text-sm text-ink-900">{applyMessage}</p>
      )}

      {matchResult && (
        <div className="mt-6">
          <MatchExplanation
            matchScore={matchResult.matchScore}
            missingKeywords={matchResult.missingKeywords}
          />
        </div>
      )}

      <div className="mt-8 prose max-w-none text-ink-900">
        <h2 className="text-lg font-semibold mb-2">Job Description</h2>
        <p className="whitespace-pre-line text-ink-500">{job.description}</p>
      </div>
    </div>
  );
}