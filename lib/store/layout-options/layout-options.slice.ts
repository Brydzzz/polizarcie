import { createSlice } from "@reduxjs/toolkit";
import { DispatchAction } from "../store";

type LayoutOptionsState = {
  restaurantPage: {
    view: "menu" | "reviews";
  };
};

const INITIAL_STATE: LayoutOptionsState = {
  restaurantPage: {
    view: "menu",
  },
};

export const layoutOptionsSlice = createSlice({
  name: "layoutOptions",
  initialState: INITIAL_STATE,
  reducers: {
    setRestaurantPageView(state, action: DispatchAction<"menu" | "reviews">) {
      state.restaurantPage.view = action.payload;
    },
  },
});

export const { setRestaurantPageView } = layoutOptionsSlice.actions;

export const layoutOptionsReducer = layoutOptionsSlice.reducer;
