// hooks/useChatSocket.ts
import type { Message } from "@/types/chatbox/chatBoxTypes";
import { getFromLocalStorage } from "@/utils/webstorage.utls";
import { useEffect, useRef } from "react";
import { io, Socket } from "socket.io-client";

const useChatSocket = (
  userId: string,
  onMessage: (msg: Message) => void,
  onRead: (id: string) => void
) => {
  const socketRef = useRef<Socket | null>(null);

  useEffect(() => {
    socketRef.current = io(`${import.meta.env.VITE_PUBLIC_BACKEND_URL}/chat`, {
      withCredentials: true,
      auth: { userId, token: getFromLocalStorage("authToken") },
    });

    socketRef.current.emit("join", userId);
    socketRef.current.on("private-message", onMessage);
    socketRef.current.on("message-read", onRead);

    return () => {
      if (socketRef.current) {
        socketRef.current.off("private-message", onMessage);
        socketRef.current.off("message-read", onRead);
        socketRef.current.disconnect();
      }
    };
  }, [userId, onMessage, onRead]);

  return {
    sendMessage: (content: string, receiver: string, sender: string) => {
      socketRef.current?.emit("private-message", { content, receiver, sender });
    },
    markAsRead: (messageId: string) => {
      socketRef.current?.emit("mark-read", messageId);
    },
  };
};

export default useChatSocket;
