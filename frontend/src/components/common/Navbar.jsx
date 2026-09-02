import { Link, useNavigate } from "react-router-dom";
import { useAuthStore } from "../../store/authStore";

export default function Navbar() {
  const { user, token, logout } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <header className="border-b border-slate-100">
      <nav className="max-w-6xl mx-auto flex items-center justify-between px-6 py-4">
        <Link to="/" className="text-xl font-bold text-primary-700">
          AI Job Portal
        </Link>
        <div className="flex items-center gap-6 text-sm font-medium text-ink-500">
          <Link to="/jobs" className="hover:text-primary-600">Jobs</Link>
          <Link to="/resume-check" className="hover:text-primary-600">Resume Check</Link>
          <Link to="/resume-check/history" className="hover:text-primary-600">History</Link>
          <Link to="/dashboard" className="hover:text-primary-600">Dashboard</Link>

          {token ? (
            <>
              <span className="text-ink-900">Hi, {user?.name?.split(" ")[0] || "there"}</span>
              <button
                onClick={handleLogout}
                className="bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700"
              >
                Logout
              </button>
            </>
          ) : (
            <Link
              to="/login"
              className="bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700"
            >
              Login
            </Link>
          )}
        </div>
      </nav>
    </header>
  );
}