export type UserInitialStateType = {
  userData: Object;
  loading: boolean;
  error: string | null | undefined;
};

export type UserType = {
  _id: string;
  name: string;
  email: string;
  password: string;
  createdAt: Date;
  updatedAt: Date;
  profilePic: string;
};

export interface Student {
  _id: string;
  name: string;
  profilePic: string;
  interests: string[];
  subjects: string[];
  languages: string[];
  bio: string;
}

export interface StudentCardProps {
  student: StudentResponse;
  onConnect: (id: string) => void;
  onCancelRequest: (id: string) => void;
  onViewProfile: (student: StudentResponse) => void;
  isCompact?: boolean;
  connectionStatus: string;
}

// server response types

export interface StudentResponse {
  _id: string;
  name: string;
  email: string;
  profilePic: string;
  interests: string[];
  subjects: string[];
  languages: string[];
  bio: string;
  availability: string[];
  connections: string[];
  pendingRequests: string[];
  university: string;
  sentRequests: string[];
}
