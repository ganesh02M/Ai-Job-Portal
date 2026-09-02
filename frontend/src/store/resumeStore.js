import { create } from "zustand";
import {
  getResumeHistory,
  getResumeById,
  uploadResume,
  scoreResume,
  matchJobDescription,
} from "../api/resumeApi";

export const useResumeStore = create((set, get) => ({
  resumes: [],
  currentResume: null,
  loading: false,
  error: "",

  // Fetch all resumes for history/dashboard
  fetchHistory: async () => {
    set({ loading: true, error: "" });
    try {
      const { data } = await getResumeHistory();
      set({ resumes: data, loading: false });
      return data;
    } catch (err) {
      set({
        error: err.response?.data?.message || "Failed to load history",
        loading: false,
      });
    }
  },

  // Fetch a single resume by id
  fetchResumeById: async (id) => {
    set({ loading: true, error: "" });
    try {
      const { data } = await getResumeById(id);
      set({ currentResume: data, loading: false });
      return data;
    } catch (err) {
      set({
        error: err.response?.data?.message || "Failed to load resume",
        loading: false,
      });
    }
  },

  // Upload a new resume file
  upload: async (file) => {
    set({ loading: true, error: "" });
    try {
      const { data } = await uploadResume(file);
      set((state) => ({
        resumes: [data, ...state.resumes],
        currentResume: data,
        loading: false,
      }));
      return data;
    } catch (err) {
      set({
        error: err.response?.data?.message || "Upload failed",
        loading: false,
      });
      throw err;
    }
  },

  // Trigger ATS scoring for the current resume
  runScore: async (id) => {
    set({ loading: true, error: "" });
    try {
      await scoreResume(id);
      const { data } = await getResumeById(id);
      set({ currentResume: data, loading: false });
      return data;
    } catch (err) {
      set({
        error: err.response?.data?.message || "Scoring failed",
        loading: false,
      });
      throw err;
    }
  },

  // Match current resume against a job description
  runMatch: async (id, jobDescription) => {
    set({ loading: true, error: "" });
    try {
      const { data } = await matchJobDescription(id, jobDescription);
      set((state) => ({
        currentResume: state.currentResume
          ? {
              ...state.currentResume,
              jdMatch: {
                jobDescription,
                matchPercent: data.matchPercent,
                missingKeywords: data.missingKeywords,
                suggestions: data.suggestions,
              },
            }
          : state.currentResume,
        loading: false,
      }));
      return data;
    } catch (err) {
      set({
        error: err.response?.data?.message || "Matching failed",
        loading: false,
      });
      throw err;
    }
  },

  clearError: () => set({ error: "" }),
  clearCurrentResume: () => set({ currentResume: null }),
}));