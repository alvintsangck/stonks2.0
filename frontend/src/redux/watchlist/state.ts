import { Stock } from "../stocks/state";

export type Watchlist = {
	id: number;
	name: string;
};

export type WatchlistState = {
	watchlists: Watchlist[];
	stocks: Stock[];
	isLoading: boolean;
};
