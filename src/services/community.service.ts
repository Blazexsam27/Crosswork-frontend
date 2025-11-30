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

  getAllCommunities = async () => {
    try {
      const response = await axios.get(this.endpoint);
      return response.data;
    } catch (error: any) {
      throw new Error(error);
    }
  };

  getCommunityById = async (communityId: string) => {
    try {
      const response = await axios.get(`${this.endpoint}/${communityId}`);
      return response.data;
    } catch (error: any) {
      throw new Error(error);
    }
  };

  updateCommunity = async (communityId: string, formData: FormData) => {
    try {
      const response = await axios.put(
        `${this.endpoint}/${communityId}`,
        formData
      );
      return response.data;
    } catch (error: any) {
      throw new Error(error);
    }
  };

  deleteCommunity = async (communityId: string) => {
    try {
      const response = await axios.delete(`${this.endpoint}/${communityId}`);
      return response.data;
    } catch (error: any) {
      throw new Error(error);
    }
  };

  getCommunityPosts = async (communityId: string) => {
    try {
      const response = await axios.get(`${this.endpoint}/${communityId}/posts`);
      return response.data;
    } catch (error: any) {
      throw new Error(error);
    }
  };
}

export default new CommunityService();
