import type { ThreadRetrieveType } from "@/types/forums/forumTypes";
import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

const forumSlice = createSlice({
  name: "forum",
  initialState: {
    cache: {} as Record<string, ThreadRetrieveType>,
    currentThreadId: null as string | null,
  },
  reducers: {
    cacheThread(state, action: PayloadAction<ThreadRetrieveType>) {
      state.cache[action.payload._id] = action.payload;
    },

    setCurrentThread(state, action: PayloadAction<string>) {
      state.currentThreadId = action.payload;
    },
  },
});

export const { cacheThread, setCurrentThread } = forumSlice.actions;
export default forumSlice.reducer;
