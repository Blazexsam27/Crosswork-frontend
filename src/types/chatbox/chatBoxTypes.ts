export interface Connection {
  _id: string;
  name: string;
  avatar: string;
  status: "online" | "offline" | "away";
  lastSeen?: string;
  unreadCount?: number;
}

export interface Message {
  sender: string;
  receiver: string;
  content: string;
}

export type MessageFromDb = {
  _id: string;
  sender: string;
  receiver: string;
  content: string;
  read: boolean;
  createdAt: string;
  updatedAt: string;
};

export interface Chat {
  connectionId: string;
  messages: Message[];
}
