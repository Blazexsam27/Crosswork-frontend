import type {
  ThreadCreateType,
  ThreadRetrieveType,
} from "@/types/forums/forumTypes";
import axios from "../config/axios.config";

class ThreadService {
  endpoint = "/api/threads";

  async createThread(thread: ThreadCreateType) {
    try {
      const response = await axios.post(this.endpoint, thread);
      return response.data;
    } catch (error: any) {
      throw new Error(error);
    }
  }

  async getThreadById(threadId: string) {
    try {
      const response = await axios.get(`${this.endpoint}/${threadId}`);
      return response.data;
    } catch (error: any) {
      throw new Error(error);
    }
  }

  async getAllThreads() {
    try {
      const response = await axios.get(`${this.endpoint}/all`);
      return response.data;
    } catch (error: any) {
      throw new Error(error);
    }
  }

  async getThreadsByCategory(category: string) {
    try {
      const response = await axios.post(`${this.endpoint}/category`, {
        category,
      });
      return response.data;
    } catch (error: any) {
      throw new Error(error);
    }
  }

  async getThreadsByCategoryAndUser(category: string, userId: string) {
    try {
      const response = await axios.post(`${this.endpoint}/category-and-user`, {
        category,
        userId,
      });
      return response.data;
    } catch (error: any) {
      throw new Error(error);
    }
  }

  async updateThread(
    threadId: string,
    updatedData: Partial<ThreadRetrieveType>
  ) {
    try {
      const response = await axios.put(
        `${this.endpoint}/${threadId}`,
        updatedData
      );
      return response.data;
    } catch (error: any) {
      throw new Error(error);
    }
  }

  //method to delete thread
  async deleteThread(threadId: string) {
    try {
      const response = await axios.delete(`${this.endpoint}/${threadId}`);
      return response.data;
    } catch (error: any) {
      throw new Error(error);
    }
  }
}

export default new ThreadService();
