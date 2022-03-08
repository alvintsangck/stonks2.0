import { RouterState } from "connected-react-router";
import { AuthState } from "../auth/state";
import { ThemeState } from "../theme/state";
import { PortfolioState } from "../portfolio/state";
import { WatchlistState } from "../watchlist/state";
import { NewsState } from "../news/state";
import { ScreenerState } from "../screener/state";
import { StockState } from "../stock/state";

export type RootState = {
	auth: AuthState;
	theme: ThemeState;
	news: NewsState;
	screener: ScreenerState;
	stock: StockState;
	watchlist: WatchlistState;
	router: RouterState;
	portfolio: PortfolioState;
};
