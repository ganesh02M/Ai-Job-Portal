import { Link } from "react-router-dom";

export default function DashboardHome() {
  return (
    <div className="max-w-3xl mx-auto px-6 py-10">
      <h1 className="text-2xl font-bold text-ink-900 mb-6">Your Dashboard</h1>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Link to="/dashboard/applied" className="bg-white border border-slate-100 rounded-xl p-6 hover:shadow-md">
          <p className="font-semibold text-ink-900">Applied Jobs</p>
          <p className="text-sm text-ink-500 mt-1">Track your application status</p>
        </Link>
        <Link to="/dashboard/saved" className="bg-white border border-slate-100 rounded-xl p-6 hover:shadow-md">
          <p className="font-semibold text-ink-900">Saved Jobs</p>
          <p className="text-sm text-ink-500 mt-1">Jobs you bookmarked</p>
        </Link>
        <Link to="/resume-check" className="bg-white border border-slate-100 rounded-xl p-6 hover:shadow-md">
          <p className="font-semibold text-ink-900">Resume Check</p>
          <p className="text-sm text-ink-500 mt-1">Get your ATS score</p>
        </Link>
      </div>
    </div>
  );
}
