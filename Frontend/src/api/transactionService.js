import api from "./axiosInstance";

const transactionService = {
  async getTransactions() {
    try {
      const response = await api.get("/api/transactions");
      return response.data;
    } catch (error) {
      throw new Error("Fetch failed: " + error.message);
    }
  },

  async addTransaction(transactionData) {
    try {
      const response = await api.post("/api/transactions", transactionData);
      return response.data;
    } catch (error) {
      throw new Error("Transaction adding failed: " + error.message);
    }
  },

  async deleteTransaction(id) {
    try {
      await api.delete(`/api/transactions/${id}`);
      return true;
    } catch (error) {
      throw new Error("Deletion failed: " + error.message);
    }
  },

  async updateTransaction(id, updatedData) {
    try {
      const response = await api.put(`/api/transactions/${id}`, updatedData);
      return response.data;
    } catch (error) {
      throw new Error("Update failed: " + error.message);
    }
  },

  async getCategories() {
    try {
      const response = await api.get("/api/categories");
      return response.data;
    } catch (error) {
      throw new Error("Fetch failed: " + error.message);
    }
  },

  async getSummary(yearMonth) {
    try {
      const response = await api.get(
        `/api/transactions/summary?yearMonth=${yearMonth}`,
      );

      return response.data;
    } catch (error) {
      throw new Error("Summary fetch failed: " + error.message);
    }
  },
};

export default transactionService;
