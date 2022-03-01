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
			console.log(result.error);
		} else {
			dispatch(getAllWatchlistsAction(result));
		}
	};
}

export function getWatchlistThunk(watchlistId: number | null) {
	return async (dispatch: RootDispatch) => {
		const result = await callApi(`/watchlist/${watchlistId}`);
		if ("error" in result) {
			console.log(result.error);
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
			console.log(result.error);
		} else {
			dispatch(addWatchlistAction(result, name));
		}
	};
}

export function renameWatchlistThunk(watchlistId: number, name: string) {
	return async (dispatch: RootDispatch) => {
		const result = await callApi(`/watchlist/${watchlistId}`, "DELETE");
		if ("error" in result) {
			console.log(result.error);
		} else {
			dispatch(renameWatchlistAction(watchlistId, name));
		}
	};
}

export function deleteWatchlistThunk(watchlistId: number) {
	return async (dispatch: RootDispatch) => {
		const result = await callApi(`/watchlist/${watchlistId}`, "DELETE");
		if ("error" in result) {
			console.log(result.error);
		} else {
			dispatch(deleteWatchlistAction(watchlistId));
		}
	};
}

export function addStockThunk(watchlistId: number, stockId: number) {
	return async (dispatch: RootDispatch) => {
		const result = await callApi(`/watchlist/${watchlistId}/${stockId}`, "POST");
		if ("error" in result) {
			console.log(result.error);
		} else {
			dispatch(addStockToWatchlistAction(result));
		}
	};
}

export function deleteStockThunk(watchlistId: number, stockId: number) {
	return async (dispatch: RootDispatch) => {
		const result = await callApi(`/watchlist/${watchlistId}/${stockId}`, "DELETE");
		if ("error" in result) {
			console.log(result.error);
		} else {
			dispatch(deleteStockFromWatchlistAction(stockId));
		}
	};
}
