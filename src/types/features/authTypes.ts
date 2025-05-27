export type AuthInitialStateType = {
  token: string | null;
  isAuthenticated: boolean | null;
  loading: boolean;
  error: string | null | undefined;
};

export type UserRegister = {
  name: string;
  email: string;
  password: string;
  authProvider: string;
};
