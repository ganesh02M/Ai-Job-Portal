const ScoreGauge = ({ score, label = "ATS Score" }) => {
  const value = score ?? 0;

  const getColor = () => {
    if (value >= 75) return "var(--color-success)";
    if (value >= 50) return "var(--color-accent)";
    return "var(--color-alert)";
  };

  return (
    <div className="bg-surface rounded-2xl border border-line p-6 shadow-sm">
      <div className="flex items-baseline justify-between mb-4">
        <span className="font-body text-sm font-medium text-ink-soft">
          {label}
        </span>
        <span className="font-display text-4xl font-bold text-ink">
          {score === null || score === undefined ? "--" : value}
          <span className="text-base text-ink-soft/50">/100</span>
        </span>
      </div>

      <div className="relative h-3 bg-bg rounded-full overflow-hidden">
        <div
          className="absolute inset-y-0 left-0 rounded-full transition-all duration-700"
          style={{ width: `${value}%`, backgroundColor: getColor() }}
        />
      </div>
    </div>
  );
};

export default ScoreGauge;