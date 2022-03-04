import { StockAction } from "./action";
import { StockState } from "./state";

const initialState: StockState = {
	stock: null,
	comments: [],
};

export function stockReducer(state: StockState = initialState, action: StockAction) {
	switch (action.type) {
		case "@@Stock/get_stock":
			return { ...state, stock: action.stock };
		case "@@Stock/get_comments":
			return { ...state, comments: action.comments };
		case "@@Stock/post_comment":
			return { ...state, comments: state.comments.concat(action.comment) };
		default:
			return state;
	}
}
