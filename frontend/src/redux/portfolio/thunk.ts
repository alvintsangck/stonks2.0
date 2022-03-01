import { callApi } from "../api";
import { RootDispatch } from "../store/action";

export function getPortfolioThunk() {
	return async (dispatch: RootDispatch) => {
		const result = await callApi("/user/portfolio", "GET");
		if ("error" in result) {
			/*fail action*/
			// dispatch();
		} else {
			/*success action*/
			// dispatch();
		}
	};
}
