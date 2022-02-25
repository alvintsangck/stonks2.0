import { RouterState } from "connected-react-router";
import { AuthState } from "../auth/state";
import { ThemeState } from "../theme/state";
import { PortfolioState } from "../portfolio/state";

export type RootState = {
	auth: AuthState;
	theme: ThemeState;
	router: RouterState;
	portfolio: PortfolioState;
};
