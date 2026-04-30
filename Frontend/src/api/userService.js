import api from "./axiosInstance";

const userService = {
  async updateUserBudget(userId, budget) {
    try {
      await api.put(`/api/users/${userId}`, {
        monthlyBudget: budget,
      });
    } catch (error) {
      throw new Error("Update failed: " + error.message);
    }
  },
};

export default userService;
