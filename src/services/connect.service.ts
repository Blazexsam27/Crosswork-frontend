import axios from "../config/axios.config";

class ConnectService {
  sendConnectRequest = async (targetUserId: string, senderId: string) => {
    try {
      const response = await axios.post(
        `/api/users/connect?targetId=${targetUserId}&senderId=${senderId}`
      );
      return response.data;
    } catch (error) {
      console.error("Error while connecting:", error);
    }
  };

  acceptRequest = async (targetUserId: string, senderId: string) => {
    try {
      const response = await axios.post(
        `/api/users/accept?targetId=${targetUserId}&senderId=${senderId}`
      );
      return response.data;
    } catch (error) {
      console.error("Error while connecting:", error);
    }
  };
}

export default new ConnectService();
