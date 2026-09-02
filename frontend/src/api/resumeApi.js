import api from "./axios";

export const uploadResume = (file) => {
  const formData = new FormData();
  formData.append("resume", file);
  return api.post("/resume/upload", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
};

export const getResumeHistory = () => api.get("/resume/history");
export const getResumeById = (id) => api.get(`/resume/${id}`);
export const scoreResume = (id) => api.post(`/resume/${id}/score`);
export const matchJobDescription = (id, jobDescription) =>
  api.post(`/resume/${id}/match`, { jobDescription });
export const generateCoverLetter = (id, jobDescription) =>
  api.post(`/resume/${id}/cover-letter`, { jobDescription });