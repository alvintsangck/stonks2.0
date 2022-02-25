import { callApi } from "../api";
import { RootDisPatch } from "../store/action";

export function getPortfolioThunk() {
	return async (dispatch: RootDisPatch) => {
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
