import api from "./api";

export const getJobs = (params) => api.get("/jobs", { params });
export const getJobById = (id) => api.get(`/jobs/${id}`);
export const createJob = (data) => api.post("/jobs", data);
export const updateJob = (id, data) => api.put(`/jobs/${id}`, data);
export const deleteJob = (id) => api.delete(`/jobs/${id}`);
export const getMyPostedJobs = () => api.get("/jobs/recruiter/mine");

export const applyToJob = (jobId, resumeId) =>
  api.post(`/applications/${jobId}`, { resumeId });
export const getMyApplications = () => api.get("/applications/mine");
export const withdrawApplication = (id) => api.delete(`/applications/${id}`);

export const saveJob = (jobId) => api.post(`/applications/save/${jobId}`);
export const unsaveJob = (jobId) => api.delete(`/applications/save/${jobId}`);
export const getSavedJobs = () => api.get("/applications/saved");

export const getApplicantsForJob = (jobId) =>
  api.get(`/applications/job/${jobId}`);
export const updateApplicationStatus = (id, status) =>
  api.patch(`/applications/${id}/status`, { status });
