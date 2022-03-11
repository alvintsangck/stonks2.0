import { defaultErrorSwal } from "../../components/ReactSwal";
import { callApi } from "../api";
import { RootDispatch } from "../store/action";
import { getCommentsAction, getStockNewsAction, getStockAction, postCommentAction } from "./action";

export function getStockThunk(ticker: string) {
	return async (dispatch: RootDispatch) => {
		const result = await callApi(`/stocks/${ticker}`);
		if ("error" in result) {
			defaultErrorSwal(result.error);
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

export function postCommentThunk(stockId: number, comment: string) {
	return async (dispatch: RootDispatch) => {
		const result = await callApi(`/comment/${stockId}`, "POST", { comment });
		if ("error" in result) {
			defaultErrorSwal(result.error);
		} else {
			dispatch(postCommentAction(result));
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