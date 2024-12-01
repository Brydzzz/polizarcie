import { combineReducers } from "@reduxjs/toolkit";
import { layoutOptionsReducer } from "./layout-options/layout-options.slice";
import { userReducer } from "./user/user.slice";

export const rootReducer = combineReducers({
  user: userReducer,
  layoutOptions: layoutOptionsReducer,
});
