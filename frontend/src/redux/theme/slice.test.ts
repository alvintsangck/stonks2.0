import { themeSlice, toggleTheme } from "./slice";

import { ThemeState } from "./state";

describe("Theme Reducer", () => {
	let initialState: ThemeState;
	beforeEach(() => {
		initialState = { theme: "light" };
	});

	test("should change theme", () => {
		const newState = themeSlice.reducer(initialState, toggleTheme());
		expect(newState).toMatchObject({ theme: "dark" });
	});
});
