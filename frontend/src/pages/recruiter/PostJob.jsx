import { useState } from "react";
import { createJob } from "../../services/jobsApi";
import { useNavigate } from "react-router-dom";

export default function PostJob() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    title: "",
    company: "",
    description: "",
    location: "",
    salaryMin: "",
    salaryMax: "",
    jobType: "full-time",
    experienceLevel: "fresher",
    skillsRequired: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await createJob({
      ...form,
      salaryMin: Number(form.salaryMin) || undefined,
      salaryMax: Number(form.salaryMax) || undefined,
      skillsRequired: form.skillsRequired.split(",").map((s) => s.trim()).filter(Boolean),
    });
    navigate("/recruiter/manage-jobs");
  };

  return (
    <div className="max-w-2xl mx-auto px-6 py-10">
      <h1 className="text-2xl font-bold text-ink-900 mb-6">Post a Job</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input name="title" placeholder="Job title" value={form.title} onChange={handleChange}
          className="w-full border border-slate-200 rounded-lg px-3 py-2" required />
        <input name="company" placeholder="Company" value={form.company} onChange={handleChange}
          className="w-full border border-slate-200 rounded-lg px-3 py-2" required />
        <input name="location" placeholder="Location" value={form.location} onChange={handleChange}
          className="w-full border border-slate-200 rounded-lg px-3 py-2" required />
        <textarea name="description" placeholder="Job description" value={form.description} onChange={handleChange}
          rows={6} className="w-full border border-slate-200 rounded-lg px-3 py-2" required />

        <div className="grid grid-cols-2 gap-4">
          <input name="salaryMin" type="number" placeholder="Min salary" value={form.salaryMin} onChange={handleChange}
            className="border border-slate-200 rounded-lg px-3 py-2" />
          <input name="salaryMax" type="number" placeholder="Max salary" value={form.salaryMax} onChange={handleChange}
            className="border border-slate-200 rounded-lg px-3 py-2" />
        </div>

        <select name="jobType" value={form.jobType} onChange={handleChange}
          className="w-full border border-slate-200 rounded-lg px-3 py-2">
          {["full-time", "part-time", "internship", "remote", "contract"].map((t) => (
            <option key={t} value={t}>{t}</option>
          ))}
        </select>

        <select name="experienceLevel" value={form.experienceLevel} onChange={handleChange}
          className="w-full border border-slate-200 rounded-lg px-3 py-2">
          {["fresher", "0-1", "1-3", "3-5", "5+"].map((e) => (
            <option key={e} value={e}>{e}</option>
          ))}
        </select>

        <input name="skillsRequired" placeholder="Skills (comma separated)" value={form.skillsRequired} onChange={handleChange}
          className="w-full border border-slate-200 rounded-lg px-3 py-2" />

        <button type="submit"
          className="bg-primary-600 text-white px-5 py-2 rounded-lg font-medium hover:bg-primary-700">
          Post Job
        </button>
      </form>
    </div>
  );
}
