import { push } from "connected-react-router";
import { defaultErrorSwal, defaultSuccessSwal } from "../../components/ReactSwal";
import { callApi } from "../api";
import { getCashAction } from "../auth/action";
import { RootDispatch } from "../store/action";
import { getCommentsAction, getStockNewsAction, getStockAction, postCommentAction } from "./action";

export function getStockThunk(ticker: string) {
	return async (dispatch: RootDispatch) => {
		const result = await callApi(`/stocks/${ticker}`);
		if ("error" in result) {
			dispatch(push("/404"));
		} else {
			dispatch(getStockAction(result));
		}
	};
}

export function getCommentsThunk(stockId: number) {
	return async (dispatch: RootDispatch) => {
		const result = await callApi(`/comment/${stockId}`);
		if ("error" in result) {
			defaultErrorSwal(result.error);
		} else {
			dispatch(getCommentsAction(result));
		}
	};
}

export function postCommentThunk(stockId: number, content: string) {
	return async (dispatch: RootDispatch) => {
		const result = await callApi(`/comment/${stockId}`, "POST", { content });
		if ("error" in result) {
			defaultErrorSwal(result.error);
		} else {
			dispatch(postCommentAction(result.comment));
		}
	};
}

export function getStockNewsThunk(ticker: string) {
	return async (dispatch: RootDispatch) => {
		const result = await callApi(`/stocks/${ticker}/news`);
		if ("error" in result) {
			defaultErrorSwal(result.error);
		} else {
			dispatch(getStockNewsAction(result));
		}
	};
}

export function buyStockThunk(ticker: string, shares: number, price: number) {
	return async (dispatch: RootDispatch) => {
		const result = await callApi(`/stocks/${ticker}/buy`, "POST", { shares, price });
		console.log("re ", result);

		if ("error" in result) {
			defaultErrorSwal(result.error);
		} else {
			console.log("buy");

			dispatch(getCashAction(result.cash));
			defaultSuccessSwal(`Bought ${shares} share${shares > 1 ? "s" : ""} ${ticker}`);
		}
	};
}

export function sellStockThunk(ticker: string, shares: number, price: number) {
	return async (dispatch: RootDispatch) => {
		const result = await callApi(`/stocks/${ticker}/sell`, "POST", { shares, price });
		if ("error" in result) {
			defaultErrorSwal(result.error);
		} else {
			dispatch(getCashAction(result.cash));
			defaultSuccessSwal(`Sold ${shares} share${shares > 1 ? "s" : ""} ${ticker}`);
		}
	};
}
