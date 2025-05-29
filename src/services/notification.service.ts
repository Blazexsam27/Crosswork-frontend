import axios from "../config/axios.config";

class NotificationService {
  getPendingInvitesOfUser = async (userId: string) => {
    try {
      const response = await axios.get(
        `/api/notifications/get-pending-request?id=${userId}`
      );
      return response.data;
    } catch (error: any) {
      throw new Error(error);
    }
  };
}

export default new NotificationService();
