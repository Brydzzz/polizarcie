import { createSelector } from "reselect";
import { RootState } from "../store";

const selectReviewsReducer = (state: RootState) => state.reviews;

export const selectReviewsUpdate = createSelector(
  [selectReviewsReducer],
  (reviewReducer) => reviewReducer.update
);

export const selectReviewsFreeCreatorForced = createSelector(
  [selectReviewsReducer],
  (reviewReducer) => reviewReducer.freeCreatorForced
);

const selectReviewCreators = createSelector(
  [selectReviewsReducer],
  (reviewReducer) => reviewReducer.creators
);

export const selectRestaurantReviewCreator = createSelector(
  [selectReviewCreators],
  (reviewCreators) => reviewCreators.restaurant
);

export const selectDishReviewCreator = createSelector(
  [selectReviewCreators],
  (reviewCreators) => reviewCreators.dish
);
