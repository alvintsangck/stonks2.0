import { PortfolioState } from "./state";

const initialState: PortfolioState = {
	portfolio: [],
	price: [],
};

export function portfolioReducer(state: PortfolioState = initialState, action: any): PortfolioState {
	switch (action.type) {
		case "@@Portfolio/get":
			return { ...state, portfolio: action.portfolio };
		case "@@Portfolio/getPrice":
			return { ...state, price: action.stocks };
		default:
			return state;
	}
}
