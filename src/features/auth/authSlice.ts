import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import authService from "@/services/auth.service";
import {
  getFromLocalStorage,
  setInLocalStorage,
} from "@/utils/webstorage.utls";
import type {
  AuthInitialStateType,
  UserRegister,
} from "@/types/features/authTypes";

const initialState: AuthInitialStateType = {
  token: getFromLocalStorage("authToken") || null,
  isAuthenticated: !!getFromLocalStorage("authToken"),
  loading: false,
  error: null,
};

export const login = createAsyncThunk(
  "auth/login",
  async (credentials: { email: string; password: string }) => {
    const response = await authService.login(
      credentials.email,
      credentials.password
    );
    setInLocalStorage("authToken", response.token);
    return response;
  }
);

export const signup = createAsyncThunk(
  "auth/signup",
  async (credentials: UserRegister) => {
    return await authService.signup(credentials);
  }
);

const authSlice = createSlice({
  name: "auth",
  initialState: initialState,
  reducers: {
    logout: (state) => {
      state.token = null;
      state.isAuthenticated = false;
      localStorage.clear();
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
