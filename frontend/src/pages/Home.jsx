import { Link } from "react-router-dom";

export default function Home() {
  return (
    <div className="max-w-6xl mx-auto px-6 py-20 grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
      <div>
        <h1 className="text-4xl font-bold text-ink-900 leading-tight">
          Find jobs that actually{" "}
          <span className="text-primary-600">match your resume</span>
        </h1>
        <p className="text-ink-500 mt-4">
          Real listings, instant ATS scoring, and AI-powered match explanations —
          all in one place.
        </p>
        <div className="flex gap-4 mt-8">
          <Link to="/jobs" className="bg-primary-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-primary-700">
            Browse Jobs
          </Link>
          <Link to="/resume-check" className="border border-primary-600 text-primary-700 px-6 py-3 rounded-lg font-medium hover:bg-primary-50">
            Check My Resume
          </Link>
        </div>
      </div>

      <div className="bg-primary-50 rounded-2xl h-72 overflow-hidden">
<img
  src="https://images.unsplash.com/photo-1586281380349-632531db7ed4?auto=format&fit=crop&w=800&q=80"
  alt="Resume and job application"
  className="w-full h-full object-cover"
/>
</div>
    </div>
  );
}
