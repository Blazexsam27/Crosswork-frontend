import axios from "../config/axios.config";

class PostsService {
  endpoint = "/api/posts";

  async createPost(post: any) {
    try {
      const response = await axios.post(this.endpoint, post);
      return response.data;
    } catch (error: any) {
      throw new Error(error);
    }
  }

  async getPostById(postId: string) {
    try {
      const response = await axios.get(`${this.endpoint}/${postId}`);
      return response.data;
    } catch (error: any) {
      throw new Error(error);
    }
  }

  async getAllPosts() {
    try {
      const response = await axios.get(`${this.endpoint}/all`);
      return response.data;
    } catch (error: any) {
      throw new Error(error);
    }
  }

  async getPostsByCommunityId(communityId: string) {
    try {
      const response = await axios.get(
        `${this.endpoint}/community/${communityId}`
      );
      return response.data;
    } catch (error: any) {
      throw new Error(error);
    }
  }

  async getPostsByUser(userId: string) {
    try {
      const response = await axios.get(`${this.endpoint}/user/${userId}`);
      return response.data;
    } catch (error: any) {
      throw new Error(error);
    }
  }

  async updatePost(postId: string, post: any) {
    try {
      const response = await axios.put(`${this.endpoint}/${postId}`, post);
      return response.data;
    } catch (error: any) {
      throw new Error(error);
    }
  }

  async deletePost(postId: string) {
    try {
      const response = await axios.delete(`${this.endpoint}/${postId}`);
      return response.data;
    } catch (error: any) {
      throw new Error(error);
    }
  }
}

export default new PostsService();
