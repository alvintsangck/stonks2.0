import { Portfolio } from "./state";

export const getPortfolioAction = (portfolio: Portfolio[]) => ({
	type: "@@Portfolio/get" as const,
	portfolio,
});

export type PortfolioAction = ReturnType<typeof getPortfolioAction>;
