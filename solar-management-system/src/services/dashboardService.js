import api from "./api";

const dashboardService = {
  /**
   * Get Dashboard Statistics
   */
  async getDashboardStatistics() {
    const response = await api.get("/dashboard");

    return response.data;
  },
};

export default dashboardService;