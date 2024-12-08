import { createSelector } from "reselect";
import { RootState } from "../store";

const selectUiReducer = (state: RootState) => state.ui;

export const selectRestaurantPageOptions = createSelector(
  [selectUiReducer],
  (uiReducer) => uiReducer.restaurantPage
);

export const selectRestaurantPageView = createSelector(
  [selectRestaurantPageOptions],
  (restaurantPageOptions) => restaurantPageOptions.view
);

export const selectSnackbars = createSelector(
  [selectUiReducer],
  (uiReducer) => uiReducer.snackbars
);
