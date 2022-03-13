import { PortfolioAction } from "./action";
import { PortfolioState } from "./state";

const initialState: PortfolioState = {
	portfolio: [],
};

export function portfolioReducer(state: PortfolioState = initialState, action: PortfolioAction) {
	switch (action.type) {
		case "@@Portfolio/get":
			return {portfolio: action.portfolio};
		default:
			return state
	}
}
