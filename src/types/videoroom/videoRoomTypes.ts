export interface Participant {
  userId: string;
  name: string;
  avatar: string;
  isMuted: boolean;
  isVideoOn: boolean;
  isPresenting: boolean;
  isHost: boolean;
  connectionQuality: "excellent" | "good" | "poor";
}

export interface ChatMessage {
  id: string;
  userId: string;
  userName: string;
  message: string;
  timestamp: string;
  type: "message" | "system";
}
