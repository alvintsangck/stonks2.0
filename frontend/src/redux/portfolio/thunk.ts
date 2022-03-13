import { defaultErrorSwal } from "../../components/ReactSwal";
import { callApi } from "../api";
import { RootDispatch } from "../store/action";
import { getPortfolioAction } from "./action";

export function getPortfolioThunk() {
	return async (dispatch: RootDispatch) => {
		const result = await callApi("/user/portfolio");
		if ("error" in result) {
			defaultErrorSwal(result.error);
		} else {
			dispatch(getPortfolioAction(result.portfolio));
		}
	};
}
