import { createSelector } from "reselect";
import { RootState } from "../store";

const selectCacheReducer = (state: RootState) => state.cache;

export const selectPreviousSessionStatus = createSelector(
  [selectCacheReducer],
  (cacheReducer) => cacheReducer.previousSessionStatus
);
