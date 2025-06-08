import axios from "../config/axios.config";

/**
 * targetUserId: The ID of the user you want to connect with.
 * senderId: The ID of the user who is sending the connection request (Currently Logged In User).
 */

class ConnectService {
  endpoint = "/api/connect";

  sendConnectRequest = async (targetUserId: string, senderId: string) => {
    try {
      const response = await axios.post(
        `${this.endpoint}?targetId=${targetUserId}&senderId=${senderId}`
      );
      return response.data;
    } catch (error) {
      console.error("Error while connecting:", error);
    }
  };

  acceptRequest = async (targetUserId: string, senderId: string) => {
    try {
      const response = await axios.post(
        `${this.endpoint}/accept?targetId=${targetUserId}&senderId=${senderId}`
      );
      return response.data;
    } catch (error) {
      console.error("Error while connecting:", error);
    }
  };

  declineRequest = async (targetUserId: string, senderId: string) => {
    try {
      const response = await axios.post(
        `${this.endpoint}/decline?targetId=${targetUserId}&senderId=${senderId}`
      );
      return response.data;
    } catch (error: any) {
      throw new Error(error);
    }
  };

  disconnect = async (targetUserId: string, senderId: string) => {
    try {
      const response = await axios.post(
        `${this.endpoint}/disconnect?targetId=${targetUserId}&senderId=${senderId}`
      );
      return response.data;
    } catch (error: any) {
      throw new Error(error);
    }
  };
}

export default new ConnectService();
