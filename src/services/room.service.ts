import type { RoomType } from "@/types/room/roomTypes";
import axios from "../config/axios.config";

class RoomService {
  async createRoom(roomData: Partial<RoomType>) {
    try {
      const response = await axios.post("/api/rooms", roomData);
      return response.data;
    } catch (error: any) {
      throw new Error(error);
    }
  }

  getRoomById = async (roomId: string) => {
    try {
      const response = await axios.get(`/api/rooms/${roomId}`);
      return response.data;
    } catch (error: any) {
      throw new Error(error);
    }
  };

  deleteRoomById = async (roomId: string) => {
    try {
      const response = await axios.delete(`/api/rooms/${roomId}`);
      return response.data;
    } catch (error: any) {
      throw new Error(error);
    }
  };
}

export default new RoomService();
