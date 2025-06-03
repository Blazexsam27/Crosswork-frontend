import type { UserProfile } from "@/types/profile/profileTypes";
import axios from "../config/axios.config";

class RecommendService {
  getRecommendations = async (user: UserProfile) => {
    try {
      const response = await axios.post("/api/recommend", user);

      return response.data;
    } catch (error: any) {
      throw new Error(error);
    }
  };
}

export default new RecommendService();
