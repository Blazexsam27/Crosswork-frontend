import userService from "@/services/user.service";
import type { UserInitialStateType } from "@/types/user/userTypes";
import { setInLocalStorage } from "@/utils/webstorage.utls";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

export const getUser = createAsyncThunk("user/getUser", async () => {
  const result = await userService.getUser();
  console.log("user", result);
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
      })
      .addCase(getUser.pending, (state) => {
        state.loading = true;
      })
      .addCase(getUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export default userSlice.reducer;
