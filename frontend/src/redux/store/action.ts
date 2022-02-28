import { CallHistoryMethodAction } from "connected-react-router";
import { Dispatch } from "redux";
import { AuthAction } from "../auth/action";
import { ThemeAction } from "../theme/action";
import { PortfolioAction } from "../portfolio/action";
import { WatchlistAction } from "../watchlist/action";

export type RootAction = AuthAction | ThemeAction | WatchlistAction | CallHistoryMethodAction | PortfolioAction;

export type RootDispatch = Dispatch<RootAction>;
