import type { User } from "../user/userTypes";

export type AuthInitialStateType = {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean | null;
  loading: boolean;
  error: string | null | undefined;
};
