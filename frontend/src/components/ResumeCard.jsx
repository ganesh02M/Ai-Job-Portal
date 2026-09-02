import { Link } from "react-router-dom";

const ResumeCard = ({ resume }) => {
  const date = new Date(resume.createdAt).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });

  return (
    <Link
      to={`/resume/${resume._id}`}
      className="flex items-center justify-between bg-surface rounded-2xl border border-line px-6 py-5 hover:shadow-md hover:border-accent/30 transition-all"
    >
      <div>
        <p className="font-body font-semibold text-ink">{resume.fileName}</p>
        <p className="font-body text-xs text-ink-soft/60 mt-1">{date}</p>
      </div>
      <div className="font-display text-2xl font-bold text-accent">
        {resume.atsScore ?? "--"}
        <span className="text-xs text-ink-soft/50 font-body">/100</span>
      </div>
    </Link>
  );
};

export default ResumeCard;