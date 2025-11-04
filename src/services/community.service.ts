import axios from "../config/axios.config";

class CommunityService {
  endpoint = "/api/community";

  createCommunity = async (formData: FormData) => {
    try {
      const response = await axios.post(this.endpoint, formData);
      return response.data;
    } catch (error: any) {
      throw new Error(error);
    }
  };
}

export default new CommunityService();
