import type { UserRegister } from "@/types/features/authTypes";
import axios from "../config/axios.config";

class AuthService {
  login = async (email: string, password: string) => {
    try {
      const response = await axios.post("/api/auth/login", {
        email,
        password,
      });

      return response.data;
    } catch (error: any) {
      throw new Error(error);
    }
  };

  signup = async (credentials: UserRegister) => {
    try {
      const response = await axios.post("/api/auth/register", credentials);
      return response.data;
    } catch (error: any) {
      throw new Error(error);
    }
  };

  forgotPassword = async (email: string) => {
    try {
      const response = await axios.post("/api/auth/forgot-password", { email });
      return response.data;
    } catch (error: any) {
      throw new Error(error);
    }
  };

  resetPassword = async (password: string, token: string | undefined) => {
    try {
      const response = await axios.post(`/api/auth/reset-password/${token}`, {
        newPassword: password,
      });
      return response.data;
    } catch (error: any) {
      throw new Error(error);
    }
  };
}

export default new AuthService();
