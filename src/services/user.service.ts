import axios from "../config/axios.config";
import type { UserProfile } from "@/types/profile/profileTypes";

class UserService {
  endpoint = "/api/users";

  getUser = async () => {
    try {
      const response = await axios.get(`${this.endpoint}/get-user`);
      return response.data;
    } catch (error: any) {
      throw new Error(error);
    }
  };

  getUserById = async (userId: string) => {
    try {
      const response = await axios.get(`${this.endpoint}/get-user/${userId}`);
      return response.data;
    } catch (error: any) {
      throw new Error(error);
    }
  };

  getAllUsers = async () => {
    try {
      const response = await axios.get(`${this.endpoint}/get-all-users`);
      return response.data;
    } catch (error: any) {
      throw new Error(error);
    }
  };

  getAllConnections = async (userId: string) => {
    try {
      const response = await axios.get(
        `${this.endpoint}/get-all-connections/${userId}`
      );
      return response.data;
    } catch (error: any) {
      throw new Error(error);
    }
  };

  updateUser = async (updatedData: Partial<UserProfile>) => {
    try {
      const response = await axios.put(
        `${this.endpoint}/update-user`,
        updatedData
      );
      return response.data;
    } catch (error: any) {
      throw new Error(error);
    }
  };

  joinCommunity = async (communityId: string) => {
    try {
      const response = await axios.post(
        `${this.endpoint}/join-community/${communityId}`
      );
      return response.data;
    } catch (error: any) {
      throw new Error(error);
    }
  };

  leaveCommunity = async (communityId: string) => {
    try {
      const response = await axios.post(
        `${this.endpoint}/leave-community/${communityId}`
      );
      return response.data;
    } catch (error: any) {
      throw new Error(error);
    }
  };
  bookmarkPost = async (postId: string) => {
    try {
      const response = await axios.post(`${this.endpoint}/bookmark/${postId}`);
      return response.data;
    } catch (error: any) {
      throw new Error(error);
    }
  };

  unbookmarkPost = async (postId: string) => {
    try {
      const response = await axios.delete(
        `${this.endpoint}/bookmark/${postId}`
      );
      return response.data;
    } catch (error: any) {
      throw new Error(error);
    }
  };

  getBookmarkedPosts = async () => {
    try {
      const response = await axios.get(`${this.endpoint}/bookmarks`);
      return response.data;
    } catch (error: any) {
      throw new Error(error);
    }
  };

  getUserCommunities = async () => {
    try {
      const response = await axios.get(`${this.endpoint}/communities`);
      return response.data;
    } catch (error: any) {
      throw new Error(error);
    }
  };

  searchUsers = async (query: string) => {
    try {
      const response = await axios.get(`${this.endpoint}/search`, {
        params: { q: query },
      });
      return response.data;
    } catch (error: any) {
      throw new Error(error);
    }
  };
}

export default new UserService();
