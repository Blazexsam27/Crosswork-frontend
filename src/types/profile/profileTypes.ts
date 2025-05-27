export interface Room {
  id: string;
  title: string;
  subject: string;
  date: string;
  duration: string;
  participants: number;
  status: "completed" | "cancelled";
}

export interface UserProfile {
  _id?: string;
  name: string;
  email: string;
  profilePic: string;
  interests: string[];
  subjects: string[];
  availability: string[];
  languages: string[];
  bio: string;
}
