export default function MatchExplanation({ matchScore, missingKeywords = [] }) {
  if (matchScore == null) return null;

  return (
    <div className="bg-accent-500/5 border border-accent-500/20 rounded-lg p-4">
      <p className="font-semibold text-accent-600">{matchScore}% match with your resume</p>
      {missingKeywords.length > 0 ? (
        <p className="text-sm text-ink-500 mt-1">
          Missing skills: {missingKeywords.join(", ")}
        </p>
      ) : (
        <p className="text-sm text-ink-500 mt-1">Your resume covers all key skills for this role.</p>
      )}
    </div>
  );
}
