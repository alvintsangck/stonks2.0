export type Watchlist = {
	id: number;
	name: string;
};

export type WatchlistStock = {
	id: number;
	ticker: string;
	name: string;
	prevPrice: number;
	price: number;
};

export type WatchlistState = {
	watchlists: Watchlist[]
	stocks: WatchlistStock[]
};
