import { createId } from "@paralleldrive/cuid2";
import { createSlice } from "@reduxjs/toolkit";
import { DispatchAction } from "../store";

export type SnackbarData = {
  id: string;
  message: string;
  timeout: number;
  type: "success" | "error" | "warning" | "information";
};

type UiState = {
  restaurantPage: {
    view: "menu" | "reviews";
  };
  snackbars: SnackbarData[];
};

const INITIAL_STATE: UiState = {
  restaurantPage: {
    view: "menu",
  },
  snackbars: [],
};

export const UiSlice = createSlice({
  name: "ui",
  initialState: INITIAL_STATE,
  reducers: {
    setRestaurantPageView(state, action: DispatchAction<"menu" | "reviews">) {
      state.restaurantPage.view = action.payload;
    },
    addSnackbar(
      state,
      action: DispatchAction<Partial<Omit<SnackbarData, "id">>>
    ) {
      state.snackbars.push({
        message: "",
        type: "information",
        timeout: 3000,
        ...action.payload,
        id: createId(),
      });
    },
    removeSnackbar(state, action: DispatchAction<SnackbarData["id"]>) {
      state.snackbars = state.snackbars.filter((s) => s.id !== action.payload);
    },
  },
});

export const { setRestaurantPageView, addSnackbar, removeSnackbar } =
  UiSlice.actions;

export const UiReducer = UiSlice.reducer;
