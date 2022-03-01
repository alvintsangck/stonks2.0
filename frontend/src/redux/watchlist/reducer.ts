import { WatchlistAction } from "./action";
import { WatchlistState } from "./state";

const initialState: WatchlistState = {
	watchlists: [],
	watchlistId: null,
	stocks: [],
};

export function watchlistReducer(state: WatchlistState = initialState, action: WatchlistAction) {
	switch (action.type) {
		case "@@Watchlist/get_all":
			return { ...state, watchlists: action.watchlists, watchlistId: action.watchlists[0].id };
		case "@@Watchlist/get":
			return { ...state, stocks: action.stocks, watchlistId: action.watchlistId };
		case "@@Watchlist/add":
			const { watchlistId, name } = action;
			return { ...state, watchlists: state.watchlists.concat([{ id: watchlistId, name }]) };
		case "@@Watchlist/rename":
			return {
				...state,
				watchlists: state.watchlists.map((watchlist) => {
					if (watchlist?.id === action.watchlistId) {
						return { id: action.watchlistId, name: action.name };
					}
					return watchlist;
				}),
			};
		case "@@Watchlist/delete":
			const newWatchlists = state.watchlists.filter((watchlist) => watchlist!.id !== action.watchlistId);
			return { ...state, watchlists: newWatchlists };
		case "@@Watchlist/addStock":
			return { ...state, stocks: state.stocks.concat([action.stock]) };
		case "@@Watchlist/deleteStock":
			const newStocks = state.stocks.filter((stock) => stock!.id !== action.stockId);
			return { ...state, stocks: newStocks };
		default:
			return state;
	}
}
