import { createSelector } from "reselect";
import { RootState } from "../store";

const selectLayoutOptionsReducer = (state: RootState) => state.layoutOptions;

export const selectRestaurantPageOptions = createSelector(
  [selectLayoutOptionsReducer],
  (layoutOptionReducer) => layoutOptionReducer.restaurantPage
);

export const selectRestaurantPageView = createSelector(
  [selectRestaurantPageOptions],
  (restaurantPageOptions) => restaurantPageOptions.view
);
