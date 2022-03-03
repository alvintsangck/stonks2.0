import { RouterState } from "connected-react-router";
import { AuthState } from "../auth/state";
import { ThemeState } from "../theme/state";
import { PortfolioState } from "../portfolio/state";
import { WatchlistState } from "../watchlist/state";
import { NewsState } from "../news/state";
import { ScreenerState } from "../screener/state";

export type RootState = {
	auth: AuthState;
	theme: ThemeState;
	news: NewsState;
	screener: ScreenerState;
	watchlist: WatchlistState;
	router: RouterState;
	portfolio: PortfolioState;
};
