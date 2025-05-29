import { type Middleware } from "@reduxjs/toolkit";
import { io, Socket } from "socket.io-client";
import {
  initSocket,
  setSocket,
  setConnected,
} from "../features/socket/socketSlice";
import { getFromLocalStorage } from "@/utils/webstorage.utls";

const SERVER_URL =
  import.meta.env.VITE_PUBLIC_BACKEND_URL || "http://localhost:8080";

export const socketMiddleware: Middleware = (store) => {
  let socket: Socket | null = null;

  return (next) => (action) => {
    if (initSocket.match(action) && !socket) {
      socket = io(SERVER_URL, {
        transports: ["websocket"],
        withCredentials: true,
        auth: {
          token: getFromLocalStorage("authToken"), // or Redux/cookie
        },
      });

      socket.on("connect", () => {
        store.dispatch(setSocket(socket!));
        store.dispatch(setConnected(true));
        console.log("✅ Socket connected");
      });

      socket.on("disconnect", () => {
        store.dispatch(setConnected(false));
        console.log("❌ Socket disconnected");
      });

      socket.on("connect_error", (err) => {
        console.error("Socket connection error:", err.message);
      });

      socket.on("user-joined", (userId) => {
        console.log("User joined:", userId);
      });
    }

    return next(action);
  };
};
