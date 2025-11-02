import type { Student } from "../user/userTypes";

export interface StudentProfileModalProps {
  student: Student;
  onClose: () => void;
  onConnect: (id: string) => void;
  onCancelRequest: (id: string) => void;
  connectionStatus: string;
  handleDisconnect: (id: string) => Promise<void>;
}
