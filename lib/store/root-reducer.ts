import { combineReducers } from "@reduxjs/toolkit";
import { reviewsReducer } from "./reviews/reviews.slice";
import { UiReducer } from "./ui/ui.slice";
import { userReducer } from "./user/user.slice";

export const rootReducer = combineReducers({
  user: userReducer,
  ui: UiReducer,
  reviews: reviewsReducer,
});
