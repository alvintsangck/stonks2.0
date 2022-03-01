import { push } from "connected-react-router";
import { defaultErrorSwal } from "../../helper";
import { callApi } from "../api";
import { RootDispatch } from "../store/action";
import {
	addStockToWatchlistAction,
	addWatchlistAction,
	deleteStockFromWatchlistAction,
	deleteWatchlistAction,
	getAllWatchlistsAction,
	getWatchlistAction,
	renameWatchlistAction,
} from "./action";

export function getAllWatchlistsThunk() {
	return async (dispatch: RootDispatch) => {
		const result = await callApi("/watchlist/all");
		if ("error" in result) {
			defaultErrorSwal(result.error);
		} else {
			dispatch(getAllWatchlistsAction(result));
		}
	};
}

export function getWatchlistThunk(watchlistId: number | null) {
	return async (dispatch: RootDispatch) => {
		dispatch(push(`/watchlist/${watchlistId}`));
		const result = await callApi(`/watchlist/${watchlistId}`);
		if ("error" in result) {
			defaultErrorSwal(result.error);
		} else {
			const { watchlistId, stocks } = result;
			dispatch(getWatchlistAction(watchlistId, stocks));
		}
	};
}

export function addWatchlistThunk(name: string) {
	return async (dispatch: RootDispatch) => {
		const result = await callApi("/watchlist", "POST", { name });
		if ("error" in result) {
			defaultErrorSwal(result.error);
		} else {
			dispatch(addWatchlistAction(result.id, name));
		}
	};
}

export function renameWatchlistThunk(watchlistId: number, name: string) {
	return async (dispatch: RootDispatch) => {
		const result = await callApi(`/watchlist/${watchlistId}`, "PUT");
		if ("error" in result) {
			defaultErrorSwal(result.error);
		} else {
			dispatch(renameWatchlistAction(watchlistId, name));
		}
	};
}

export function deleteWatchlistThunk(watchlistId: number) {
	return async (dispatch: RootDispatch) => {
		const result = await callApi(`/watchlist/${watchlistId}`, "DELETE");
		if ("error" in result) {
			defaultErrorSwal(result.error);
		} else {
			dispatch(deleteWatchlistAction(watchlistId));
		}
	};
}

export function addStockThunk(watchlistId: number, ticker: string) {
	return async (dispatch: RootDispatch) => {
		const stock = await getStock(ticker);
		if (stock && watchlistId > 0) {
			const stockId = stock.id;
			const result = await callApi(`/watchlist/${watchlistId}/${stockId}`, "POST");
			if ("error" in result) {
				defaultErrorSwal(result.error);
			} else {
				dispatch(addStockToWatchlistAction(stock));
			}
		}
	};
}

async function getStock(ticker: string) {
	const result = await callApi(`/stocks/${ticker}`);
	if ("error" in result) {
		defaultErrorSwal(result.error);
		return;
	}
	return result;
}

export function deleteStockThunk(watchlistId: number, stockId: number) {
	return async (dispatch: RootDispatch) => {
		const result = await callApi(`/watchlist/${watchlistId}/${stockId}`, "DELETE");
		if ("error" in result) {
			defaultErrorSwal(result.error);
		} else {
			dispatch(deleteStockFromWatchlistAction(stockId));
		}
	};
}
