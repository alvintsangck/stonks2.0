import { CallHistoryMethodAction } from "connected-react-router";
import { Dispatch } from "redux";
import { AuthAction } from "../auth/action";
import { ThemeAction } from "../theme/action";
import { PortfolioAction } from "../portfolio/action";
import { WatchlistAction } from "../watchlist/action";
import { NewsAction } from "../news/action";
import { ScreenerAction } from "../screener/action";
import { StockAction } from "../stock/action";

export type RootAction =
	| AuthAction
	| ThemeAction
	| WatchlistAction
	| NewsAction
	| ScreenerAction
	| StockAction
	| CallHistoryMethodAction
	| PortfolioAction;

export type RootDispatch = Dispatch<RootAction>;
