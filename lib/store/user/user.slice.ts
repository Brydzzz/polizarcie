import { User } from "@prisma/client";
import { createSlice } from "@reduxjs/toolkit";
import { DispatchAction } from "../store";

type UserState = {
  loading: boolean;
  currentUser: User | undefined;
};

const INITIAL_STATE: UserState = {
  currentUser: undefined,
  loading: true,
};

export const userSlice = createSlice({
  name: "user",
  initialState: INITIAL_STATE,
  reducers: {
    setCurrentUser(state, action: DispatchAction<User | undefined>) {
      state.currentUser = action.payload;
    },
    setCurrentUserLoading(state, action: DispatchAction<boolean>) {
      state.loading = action.payload;
    },
  },
});

export const { setCurrentUser, setCurrentUserLoading } = userSlice.actions;

export const userReducer = userSlice.reducer;
