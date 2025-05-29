import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import { Socket } from "socket.io-client";

interface SocketState {
  socket: Socket | null;
  isConnected: boolean;
}

const initialState: SocketState = {
  socket: null,
  isConnected: false,
};

const socketSlice = createSlice({
  name: "socket",
  initialState,
  reducers: {
    initSocket: () => {},
    setSocket(state, action: PayloadAction<Socket>) {
      state.socket = action.payload as any;
    },
    setConnected(state, action: PayloadAction<boolean>) {
      state.isConnected = action.payload;
    },
  },
});

export const { setSocket, setConnected, initSocket } = socketSlice.actions;
export default socketSlice.reducer;
