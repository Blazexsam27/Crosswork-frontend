import axios from "../config/axios.config";
import type { UserProfile } from "@/types/profile/profileTypes";

class UserService {
  getUser = async () => {
    try {
      const response = await axios.get("/api/users/get-user");

      return response.data;
    } catch (error: any) {
      throw new Error(error);
    }
  };

  getAllUsers = async () => {
    try {
      const response = await axios.get("/api/users/get-all-users");
      return response.data;
    } catch (error: any) {
      throw new Error(error);
    }
  };

  getAllConnections = async (userId: string) => {
    try {
      const response = await axios.get(
        `/api/users/get-all-connections/${userId}`
      );
      return response.data;
    } catch (error: any) {
      throw new Error(error);
    }
  };

  updateUser = async (updatedData: Partial<UserProfile>) => {
    try {
      const response = await axios.put("/api/users/update-user", updatedData);
      return response.data;
    } catch (error: any) {
      throw new Error(error);
    }
  };
}

export default new UserService();
