import { NewsAction } from "./action";
import { NewsState } from "./state";

const initialState = { news: [] };

export function newsReducer(state: NewsState = initialState, action: NewsAction) {
	switch (action.type) {
		case "@@/News/get":
			return { news: action.news };
		default:
			return state;
	}
}
