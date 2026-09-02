import { create } from "zustand";
import { getJobs } from "../services/jobsApi";

const useJobsStore = create((set, get) => ({
  jobs: [],
  total: 0,
  page: 1,
  totalPages: 1,
  loading: false,
  filters: {
    keyword: "",
    location: "",
    jobType: "",
    experienceLevel: "",
    salaryMin: "",
    salaryMax: "",
  },

  setFilters: (newFilters) =>
    set((state) => ({ filters: { ...state.filters, ...newFilters } })),

  fetchJobs: async (page = 1) => {
    set({ loading: true });
    try {
      const { filters } = get();
      const res = await getJobs({ ...filters, page, limit: 10 });
      set({
        jobs: res.data.jobs,
        total: res.data.total,
        page: res.data.page,
        totalPages: res.data.totalPages,
        loading: false,
      });
    } catch (err) {
      console.error("fetchJobs error:", err);
      set({ loading: false });
    }
  },
}));

export default useJobsStore;
