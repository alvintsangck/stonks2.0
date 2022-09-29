import { AuthState } from "../auth/state";
import { MetaMaskState } from "../metaMask/state";
import { PortfolioState } from "../portfolio/state";
import { ScreenerState } from "../screener/state";
import { ThemeState } from "../theme/state";

export type RootState = {
  auth: AuthState;
  theme: ThemeState;
  screener: ScreenerState;
  metaMask: MetaMaskState;
  portfolio: PortfolioState;
};
