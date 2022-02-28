import { RouterState } from "connected-react-router";
import { AuthState } from "../auth/state";
import { ThemeState } from "../theme/state";
import { PortfolioState } from "../portfolio/state";
import { WatchlistState } from "../watchlist/state";

export type RootState = {
	auth: AuthState;
	theme: ThemeState;
	watchlist: WatchlistState;
	router: RouterState;
	portfolio: PortfolioState;
};
