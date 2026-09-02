import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { GoogleLogin } from "@react-oauth/google";
import { registerUser, googleAuth } from "../api/authApi";
import { useAuthStore } from "../store/authStore";

const Register = () => {
  const [form, setForm] = useState({ name: "", email: "", password: "", role: "candidate" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const login = useAuthStore((state) => state.login);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const { data } = await registerUser(form);
      login({ _id: data._id, name: data.name, email: data.email, role: data.role }, data.token);
      navigate(data.role === "recruiter" ? "/recruiter/manage-jobs" : "/dashboard");
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSuccess = async (credentialResponse) => {
    setError("");
    setLoading(true);
    try {
      const { data } = await googleAuth(credentialResponse.credential);
      login({ _id: data._id, name: data.name, email: data.email, role: data.role }, data.token);
      navigate("/dashboard");
    } catch (err) {
      setError(err.response?.data?.message || "Google sign-in failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-bg flex items-center justify-center px-6">
      <div className="w-full max-w-sm bg-surface rounded-3xl shadow-xl shadow-accent/5 border border-line px-8 py-10">
        <p className="font-mono text-xs text-accent tracking-widest mb-2 font-medium">
          SMARTHIRE AI
        </p>
        <h1 className="font-display text-3xl font-bold text-ink mb-8">
          Create your account
        </h1>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="font-body text-sm font-medium text-ink-soft">
              Name
            </label>
            <input
              type="text"
              required
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="w-full mt-1.5 bg-bg border border-line rounded-xl text-ink px-4 py-2.5 font-body focus:outline-none focus:border-accent focus:ring-2 focus:ring-accent/20 transition-all"
            />
          </div>

          <div>
            <label className="font-body text-sm font-medium text-ink-soft">
              Email
            </label>
            <input
              type="email"
              required
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              className="w-full mt-1.5 bg-bg border border-line rounded-xl text-ink px-4 py-2.5 font-body focus:outline-none focus:border-accent focus:ring-2 focus:ring-accent/20 transition-all"
            />
          </div>

          <div>
            <label className="font-body text-sm font-medium text-ink-soft">
              Password
            </label>
            <input
              type="password"
              required
              minLength={6}
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              className="w-full mt-1.5 bg-bg border border-line rounded-xl text-ink px-4 py-2.5 font-body focus:outline-none focus:border-accent focus:ring-2 focus:ring-accent/20 transition-all"
            />
          </div>

          <div>
            <label className="font-body text-sm font-medium text-ink-soft">
              I am a
            </label>
            <div className="flex gap-3 mt-1.5">
              <button
                type="button"
                onClick={() => setForm({ ...form, role: "candidate" })}
                className={`flex-1 py-2.5 rounded-xl border font-body text-sm font-medium transition-all ${
                  form.role === "candidate"
                    ? "bg-accent text-white border-accent"
                    : "border-line text-ink-soft"
                }`}
              >
                Candidate
              </button>
              <button
                type="button"
                onClick={() => setForm({ ...form, role: "recruiter" })}
                className={`flex-1 py-2.5 rounded-xl border font-body text-sm font-medium transition-all ${
                  form.role === "recruiter"
                    ? "bg-accent text-white border-accent"
                    : "border-line text-ink-soft"
                }`}
              >
                Recruiter
              </button>
            </div>
          </div>

          {error && <p className="text-alert text-sm font-body">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-accent text-white font-body font-semibold py-3 rounded-full hover:opacity-90 transition-opacity disabled:opacity-50 shadow-lg shadow-accent/25"
          >
            {loading ? "Creating account..." : "Create account"}
          </button>
        </form>

        <div className="flex items-center gap-3 my-6">
          <div className="flex-1 h-px bg-line" />
          <span className="font-body text-xs text-ink-soft/60">OR</span>
          <div className="flex-1 h-px bg-line" />
        </div>

        <div className="flex justify-center">
          <GoogleLogin
            onSuccess={handleGoogleSuccess}
            onError={() => setError("Google sign-in failed")}
            theme="outline"
            shape="pill"
            width="280"
          />
        </div>

        <p className="text-ink-soft text-sm mt-6 font-body text-center">
          Already have an account?{" "}
          <Link to="/login" className="text-accent font-medium hover:underline">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Register;