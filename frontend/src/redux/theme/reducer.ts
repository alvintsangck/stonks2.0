import { ThemeAction } from "./action";
import { ThemeState } from "./state";

const initialState = {
	theme: "light",
};

export function themeReducer(state: ThemeState = initialState, action: ThemeAction) {
	switch (action.type) {
		case "@@Theme/toggle":
			return { theme: action.theme };
		default:
			return state;
	}
}
