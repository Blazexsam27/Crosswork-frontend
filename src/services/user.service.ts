import axios from "../config/axios.config";

class UserService {
  getUser = async () => {
    try {
      const response = await axios.get("/api/users/get-user");

      return response.data;
    } catch (error: any) {
      throw new Error(error);
    }
  };
}

export default new UserService();
