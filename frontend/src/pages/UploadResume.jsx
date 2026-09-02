import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { uploadResume } from "../api/resumeApi";

const UploadResume = () => {
  const [file, setFile] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) return setError("Please select a file");
    setError("");
    setLoading(true);
    try {
      const { data } = await uploadResume(file);
      navigate(`/resume/${data._id}`);
    } catch (err) {
      setError(err.response?.data?.message || "Upload failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-6 py-10">
      <p className="font-mono text-xs text-accent tracking-widest mb-2 font-medium">
        UPLOAD
      </p>
      <h1 className="font-display text-4xl font-bold text-ink mb-2">
        Analyze a resume
      </h1>
      <p className="text-ink-soft font-body mb-10">
        PDF or DOCX. We extract, score, and structure it automatically.
      </p>

      <form onSubmit={handleSubmit}>
        <label className="block bg-surface border-2 border-dashed border-line hover:border-accent rounded-3xl transition-colors p-12 text-center cursor-pointer">
          <input
            type="file"
            accept=".pdf,.docx"
            className="hidden"
            onChange={(e) => setFile(e.target.files[0])}
          />
          <p className="font-body text-sm font-medium text-ink">
            {file ? file.name : "Click to select a file"}
          </p>
          <p className="font-body text-xs text-ink-soft/60 mt-2">
            .pdf or .docx — max 5MB
          </p>
        </label>

        {error && (
          <p className="text-alert text-sm font-body mt-3">{error}</p>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full mt-6 bg-accent text-white font-body font-semibold py-3.5 rounded-full hover:opacity-90 transition-opacity disabled:opacity-50 shadow-lg shadow-accent/25"
        >
          {loading ? "Analyzing..." : "Analyze resume"}
        </button>
      </form>
    </div>
  );
};

export default UploadResume;