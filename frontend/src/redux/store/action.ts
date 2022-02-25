import { CallHistoryMethodAction } from "connected-react-router";
import { Dispatch } from "redux";
import { AuthAction } from "../auth/action";
import { ThemeAction } from "../theme/action";
import { PortfolioAction } from "../portfolio/action";

export type RootAction = AuthAction | ThemeAction | CallHistoryMethodAction | PortfolioAction;

export type RootDisPatch = Dispatch<RootAction>;
