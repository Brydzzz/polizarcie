import { createSelector } from "reselect";
import { RootState } from "../store";

const selectUserReducer = (state: RootState) => state.user;

export const selectCurrentUser = createSelector(
  [selectUserReducer],
  (userReducer) => userReducer.currentUser
);

export const selectUserLoading = createSelector(
  [selectUserReducer],
  (userReducer) => userReducer.loading
);
