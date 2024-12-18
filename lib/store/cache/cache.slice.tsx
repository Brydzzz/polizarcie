import { createSlice } from "@reduxjs/toolkit";
import { DispatchAction } from "../store";

type CacheState = {
  previousSessionStatus: "authenticated" | "unauthenticated" | undefined;
};

const INITIAL_STATE: CacheState = {
  previousSessionStatus: undefined,
};

export const cacheSlice = createSlice({
  name: "cache",
  initialState: INITIAL_STATE,
  reducers: {
    setPreviousSessionStatus(
      state,
      action: DispatchAction<"authenticated" | "unauthenticated">
    ) {
      state.previousSessionStatus = action.payload;
    },
  },
});

export const { setPreviousSessionStatus } = cacheSlice.actions;

export const cacheReducer = cacheSlice.reducer;
