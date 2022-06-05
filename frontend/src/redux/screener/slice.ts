import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Item, ScreenerItemOptions, ScreenerState, ScreenerStateKey } from "./state";

const initialState: ScreenerState = {
  [ScreenerStateKey.AddedIndustries]: [],
  [ScreenerStateKey.AddedSectors]: [],
};

export type ItemAction = {
  key: ScreenerStateKey;
  item: Item;
  value?: ScreenerItemOptions;
};

export const screenerSlice = createSlice({
  name: "screener",
  initialState,
  reducers: {
    addItem: (state, action: PayloadAction<ItemAction>) => {
      const payload = action.payload;
      const key = payload.key;
      let itemArr = state[key];
      const isInclude = payload.value === ScreenerItemOptions.Include;
      itemArr.push({ ...payload.item, isInclude });
      state[key] = itemArr;
    },
    removeItem: (state, action: PayloadAction<ItemAction>) => {
      const payload = action.payload;
      const key = payload.key;
      let itemArr = state[key];
      state[key] = itemArr.filter((item) => item.id !== payload.item.id);
    },
    resetItem: (state, action: PayloadAction<ScreenerStateKey>) => {
      const payload = action.payload;
      state[payload] = [];
    },
    resetScreenerForm: (state) => {
      state.addedIndustries = [];
      state.addedSectors = [];
    },
  },
});

export const { addItem, removeItem, resetItem, resetScreenerForm } = screenerSlice.actions;
