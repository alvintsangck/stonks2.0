export type UserPortfolio = {
	ticker: string;
	name: string;
	shares: string;
	totalCost: number;
};

export type CalcPortfolio = {
	ticker: string;
	name: string;
	price: number | string;
	shares: number;
	avgCost: number;
	totalCost: number;
	marketValue: number | string;
	profit: number | string;
};

export type PortfolioState = {
	portfolio: UserPortfolio[];
};
