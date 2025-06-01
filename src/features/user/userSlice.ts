import userService from "@/services/user.service";
import {
  type UserType,
  type UserInitialStateType,
} from "@/types/user/userTypes";
import { setInLocalStorage } from "@/utils/webstorage.utls";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

export const getUser = createAsyncThunk<UserType>("user/getUser", async () => {
  const result = await userService.getUser();
  setInLocalStorage("user", result);
  return result;
});

const initialState: UserInitialStateType = {
  userData: Object,
  loading: false,
  error: null,
};

export const userSlice = createSlice({
  name: "user",
  initialState: initialState,

  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getUser.fulfilled, (state, action) => {
        state.userData = action.payload;
        state.loading = false;
      })
      .addCase(getUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export default userSlice.reducer;
