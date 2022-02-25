export const getPortfolioAction = () => ({ type: "@@User/portfolio" as const });

export type PortfolioAction = ReturnType<typeof getPortfolioAction>;
