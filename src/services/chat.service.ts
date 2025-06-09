import axios from "../config/axios.config";

class ChatService {
  endpoint = "/api/private-messages";

  getMessages = async (senderId: string, receiverId: string) => {
    try {
      const response = await axios.get(
        `${this.endpoint}/${senderId}/${receiverId}`
      );
      return response.data;
    } catch (error: any) {
      throw new Error(error);
    }
  };
}

export default new ChatService();
