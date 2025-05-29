import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./features/auth/authSlice";
import userReducer from "./features/user/userSlice";
import socketReducer from "./features/socket/socketSlice";
import { socketMiddleware } from "./config/socket.config";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    user: userReducer,
    socket: socketReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(socketMiddleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
