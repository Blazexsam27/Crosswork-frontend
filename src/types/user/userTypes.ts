export type UserInitialStateType = {
  userData: Object;
  loading: boolean;
  error: string | null | undefined;
};

export type UserType = {
  id: string;
  name: string;
  email: string;
  password: string;
  createdAt: Date;
  updatedAt: Date;
  profilePic: string;
};
