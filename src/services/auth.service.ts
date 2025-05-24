import axios from "../config/axios.config";

class AuthService {
  login = async (email: string, password: string) => {
    try {
      const response = await axios.post("/auth/login", {
        email,
        password,
      });

      return response.data;
    } catch (error: any) {
      throw new Error(error);
    }
  };

  signup = async (email: string, password: string) => {
    try {
      const response = await axios.post("/auth/signup", {
        email,
        password,
      });
      return response.data;
    } catch (error: any) {
      throw new Error(error);
    }
  };
}

export default new AuthService();
