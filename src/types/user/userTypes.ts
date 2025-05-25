export type UserInitialStateType = {
  userData: Object;
  loading: boolean;
  error: string | null | undefined;
};

export type User = {
  id: string;
  name: string;
  email: string;
  password: string;
  createdAt: Date;
  updatedAt: Date;
};
