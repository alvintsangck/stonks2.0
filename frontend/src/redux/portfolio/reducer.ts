import { PortfolioAction } from "./action";
import { PortfolioState } from "./state";

const initialState = {
	user: {},
	error: null,
};

export function portfolioReducer(state: PortfolioState = initialState, action: PortfolioAction) {
	switch (action.type) {
		case "@@User/portfolio":
			return { ...state, error: null };
		default:
			return { ...state, error: null };
	}
}
