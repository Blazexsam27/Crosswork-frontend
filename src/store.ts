import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./features/auth/authSlice";
import userReducer from "./features/user/userSlice";
import socketReducer from "./features/socket/socketSlice";
import { socketMiddleware } from "./config/socket.config";
import forumReducer from "./features/forum/forumSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    user: userReducer,
    socket: socketReducer,
    forum: forumReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(socketMiddleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
