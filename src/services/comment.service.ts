import axios from "../config/axios.config";

class CommentService {
  endpoint = "/api/comments";

  async createComment(comment: any) {
    try {
      const response = await axios.post(this.endpoint, comment);
      return response.data;
    } catch (error: any) {
      throw new Error(error);
    }
  }

  async getCommentsByThreadId(threadId: string) {
    try {
      const response = await axios.get(`${this.endpoint}/thread/${threadId}`);
      return response.data;
    } catch (error: any) {
      throw new Error(error);
    }
  }

  async getCommentById(commentId: string) {
    try {
      const response = await axios.get(`${this.endpoint}/${commentId}`);

      return response.data;
    } catch (error: any) {
      throw new Error(error);
    }
  }

  async updateComment(commentId: string, updatedData: any) {
    try {
      const response = await axios.put(
        `${this.endpoint}/${commentId}`,
        updatedData
      );
      return response.data;
    } catch (error: any) {
      throw new Error(error);
    }
  }

  async deleteComment(commentId: string) {
    try {
      const response = await axios.delete(`${this.endpoint}/${commentId}`);
      return response.data;
    } catch (error: any) {
      throw new Error(error);
    }
  }
}

export default new CommentService();
