import type { Student } from "../user/userTypes";

export interface StudentProfileModalProps {
  student: Student;
  onClose: () => void;
  onConnect: (id: string) => void;
  onCancelRequest: (id: string) => void;
  connectionStatus: Record<string, "none" | "pending" | "connected">;
  handleDisconnect: (id: string) => Promise<void>;
}
