import { axiosBaseApi } from "../axiosBaseApi";

export const reportsApi = {
  getReport: async () => {
    try {
      const response = await axiosBaseApi.get(`/assessment/reports`, {
        withCredentials: true,
      });
      return response.data;
    } catch (error) {
      console.error("Error fetching report:", error);
      throw error;
    }
  },
};
