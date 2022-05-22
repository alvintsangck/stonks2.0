import { createSlice } from "@reduxjs/toolkit";
import { ThemeState } from "./state";

const initialState: ThemeState = {
	theme: localStorage.getItem("theme") || "light",
};

export const themeSlice = createSlice({
	name: "theme",
	initialState,
	reducers: {
		toggleTheme: (state) => {
			state.theme = state.theme === "light" ? "dark" : "light";
		},
	},
});

export const { toggleTheme } = themeSlice.actions;
