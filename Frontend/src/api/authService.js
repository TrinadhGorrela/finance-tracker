import api from "./axiosInstance";

const authService = {
  async login(email, password) {
    if (!email || !password) {
      throw new Error("Email and Password are required");
    }
    try {
      const response = await api.post("/api/auth/login", {
        email: email.trim().toLowerCase(),
        password: password.trim(),
      });
      return response;
    } catch (error) {
      throw new Error("Login failed: " + error.message);
    }
  },

  async register(name, email, password) {
    if (!name || !email || !password) {
      throw new Error("All fields are required");
    }
    try {
      const response = await api.post("/api/auth/register", {
        name: name.trim(),
        email: email.trim(),
        password: password.trim(),
      });
      return response;
    } catch (error) {
      throw new Error("Registration failed: " + error.message);
    }
  },
};
export default authService;
