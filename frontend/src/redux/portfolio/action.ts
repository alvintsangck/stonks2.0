import { UserPortfolio } from "./state";

export const getPortfolioAction = (portfolio: UserPortfolio[]) => ({
	type: "@@Portfolio/get" as const,
	portfolio,
});

export type PortfolioAction = ReturnType<typeof getPortfolioAction>;
