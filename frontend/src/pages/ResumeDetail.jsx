import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  getResumeById,
  scoreResume,
  matchJobDescription,
   generateCoverLetter,
} from "../api/resumeApi";
import ScoreGauge from "../components/ScoreGauge";

const Tag = ({ children, tone = "neutral" }) => {
  const tones = {
    neutral: "bg-bg text-ink-soft border-line",
    success: "bg-success/10 text-success border-success/20",
    alert: "bg-alert/10 text-alert border-alert/20",
  };
  return (
    <span
      className={`font-body text-xs font-medium border rounded-full px-3 py-1 inline-block ${tones[tone]}`}
    >
      {children}
    </span>
  );
};

const ResumeDetail = () => {
  const { id } = useParams();
  const [resume, setResume] = useState(null);
  const [loading, setLoading] = useState(true);
  const [scoring, setScoring] = useState(false);
  const [jd, setJd] = useState("");
  const [matching, setMatching] = useState(false);
  const [matchResult, setMatchResult] = useState(null);
  const [coverLetter, setCoverLetter] = useState(resume?.coverLetter || "");
  const [generatingLetter, setGeneratingLetter] = useState(false);
  const [copied, setCopied] = useState(false);

  const load = () => {
    getResumeById(id)
      .then(({ data }) => setResume(data))
      .finally(() => setLoading(false));
  };

  useEffect(load, [id]);

  const handleScore = async () => {
    setScoring(true);
    try {
      await scoreResume(id);
      load();
    } finally {
      setScoring(false);
    }
  };

  const handleMatch = async (e) => {
    e.preventDefault();
    if (jd.trim().length < 20) return;
    setMatching(true);
    try {
      const { data } = await matchJobDescription(id, jd);
      setMatchResult(data);
    } finally {
      setMatching(false);
    }
  };

  const handleGenerateCoverLetter = async () => {
    if (jd.trim().length < 20) return;
    setGeneratingLetter(true);
    try {
      const { data } = await generateCoverLetter(id, jd);
      setCoverLetter(data.coverLetter);
    } finally {
      setGeneratingLetter(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(coverLetter);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-6 py-10">
        <p className="font-body text-sm text-ink-soft">Loading...</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-6 py-10">
      <p className="font-mono text-xs text-accent tracking-widest mb-2 font-medium">
        ANALYSIS
      </p>
      <h1 className="font-display text-2xl font-bold text-ink mb-8 break-all">
        {resume.fileName}
      </h1>

      {/* ATS Score */}
      <div className="mb-10">
        {resume.atsScore !== null ? (
          <>
            <ScoreGauge score={resume.atsScore} />
            <p className="font-body text-sm text-ink-soft mt-4 leading-relaxed">
              {resume.atsFeedback}
            </p>
          </>
        ) : (
          <div className="bg-surface rounded-3xl border border-line p-8 text-center">
            <p className="font-body text-ink-soft mb-4">Not scored yet.</p>
            <button
              onClick={handleScore}
              disabled={scoring}
              className="bg-accent text-white font-body font-semibold px-6 py-2.5 rounded-full hover:opacity-90 disabled:opacity-50"
            >
              {scoring ? "Scoring..." : "Run ATS score"}
            </button>
          </div>
        )}
      </div>

      {/* Skills / Experience / Education */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        <div className="bg-surface rounded-2xl border border-line p-5">
          <h3 className="font-body text-xs font-semibold uppercase tracking-wide text-ink-soft/60 mb-3">
            Skills
          </h3>
          <div className="flex flex-wrap gap-2">
            {resume.parsedData?.skills?.map((s, i) => (
              <Tag key={i}>{s}</Tag>
            ))}
          </div>
        </div>
        <div className="bg-surface rounded-2xl border border-line p-5">
          <h3 className="font-body text-xs font-semibold uppercase tracking-wide text-ink-soft/60 mb-3">
            Experience
          </h3>
          <ul className="space-y-2 font-body text-sm text-ink-soft">
            {resume.parsedData?.experience?.map((e, i) => (
              <li key={i}>— {e}</li>
            ))}
          </ul>
        </div>
        <div className="bg-surface rounded-2xl border border-line p-5">
          <h3 className="font-body text-xs font-semibold uppercase tracking-wide text-ink-soft/60 mb-3">
            Education
          </h3>
          <ul className="space-y-2 font-body text-sm text-ink-soft">
            {resume.parsedData?.education?.map((e, i) => (
              <li key={i}>— {e}</li>
            ))}
          </ul>
        </div>
      </div>

      {/* JD Match */}
      <div className="bg-surface rounded-3xl border border-line p-8">
        <h2 className="font-display text-xl font-bold text-ink mb-4">
          Match against a job description
        </h2>
        <form onSubmit={handleMatch}>
          <textarea
            rows={6}
            value={jd}
            onChange={(e) => setJd(e.target.value)}
            placeholder="Paste the job description here..."
            className="w-full bg-bg border border-line rounded-2xl p-4 font-body text-sm focus:outline-none focus:border-accent focus:ring-2 focus:ring-accent/20 transition-all"
          />
          <button
            type="submit"
            disabled={matching}
            className="mt-4 bg-accent text-white font-body font-semibold px-6 py-2.5 rounded-full hover:opacity-90 disabled:opacity-50 shadow-lg shadow-accent/25"
          >
            {matching ? "Matching..." : "Check match"}
          </button>
        </form>

        {matchResult && (
          <div className="mt-8">
            <ScoreGauge score={matchResult.matchPercent} label="Match %" />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
              <div>
                <h3 className="font-body text-xs font-semibold uppercase tracking-wide text-ink-soft/60 mb-3">
                  Matching skills
                </h3>
                <div className="flex flex-wrap gap-2">
                  {matchResult.matchingSkills?.map((s, i) => (
                    <Tag key={i} tone="success">
                      {s}
                    </Tag>
                  ))}
                </div>
              </div>
              <div>
                <h3 className="font-body text-xs font-semibold uppercase tracking-wide text-ink-soft/60 mb-3">
                  Missing keywords
                </h3>
                <div className="flex flex-wrap gap-2">
                  {matchResult.missingKeywords?.map((s, i) => (
                    <Tag key={i} tone="alert">
                      {s}
                    </Tag>
                  ))}
                </div>
              </div>
            </div>

                       <div className="mt-6">
              <h3 className="font-body text-xs font-semibold uppercase tracking-wide text-ink-soft/60 mb-3">
                Suggestions
              </h3>
              <ul className="space-y-2 font-body text-sm text-ink-soft">
                {matchResult.suggestions?.map((s, i) => (
                  <li key={i}>— {s}</li>
                ))}
              </ul>
            </div>
          </div>
        )}

        {jd.trim().length >= 20 && (
          <div className="mt-6 pt-6 border-t border-line">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-body text-sm font-semibold text-ink">
                Generate a tailored cover letter
              </h3>
              <button
                onClick={handleGenerateCoverLetter}
                disabled={generatingLetter}
                className="bg-ink text-white font-body font-medium text-sm px-5 py-2 rounded-full hover:opacity-90 disabled:opacity-50"
              >
                {generatingLetter ? "Writing..." : "Generate cover letter"}
              </button>
            </div>

            {coverLetter && (
              <div className="bg-bg rounded-2xl border border-line p-6">
                <div className="flex justify-end mb-3">
                  <button
                    onClick={handleCopy}
                    className="font-body text-xs text-accent font-medium hover:underline"
                  >
                    {copied ? "Copied!" : "Copy to clipboard"}
                  </button>
                </div>
                <p className="font-body text-sm text-ink whitespace-pre-line leading-relaxed">
                  {coverLetter}
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ResumeDetail;