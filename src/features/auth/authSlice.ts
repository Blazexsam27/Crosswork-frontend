import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import authService from "@/services/auth.service";
import {
  getFromLocalStorage,
  setInLocalStorage,
} from "@/utils/webstorage.utls";
import type { AuthInitialStateType } from "@/types/features/authTypes";

const initialState: AuthInitialStateType = {
  user: null,
  token: getFromLocalStorage("authToken") || null,
  isAuthenticated: !!getFromLocalStorage("authToken"),
  loading: false,
  error: null,
};

export const login = createAsyncThunk(
  "auth/login",
  async (credentials: { email: string; password: string }) => {
    return await authService.login(credentials.email, credentials.password);
  }
);

export const signup = createAsyncThunk(
  "auth/signup",
  async (credentials: { email: string; password: string }) => {
    return await authService.signup(credentials.email, credentials.password);
  }
);

const authSlice = createSlice({
  name: "auth",
  initialState: initialState,
  reducers: {
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      setInLocalStorage("authToken", null);
    },
  },

  extraReducers: (builder) => {
    builder
      .addCase(login.pending, (state) => {
        state.loading = false;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.isAuthenticated = true;
        state.loading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
        setInLocalStorage("authToken", action.payload.token);
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;
