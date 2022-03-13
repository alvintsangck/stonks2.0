export type Portfolio = {
	stockId: number;
	ticker: string;
	name: string;
	price: string;
	shares: string;
	avgCost: string;
	totalCost: string;
	marketValue: string;
	profit: string;
	profitPercentage: string;
};

export type PortfolioState = {
	portfolio: Portfolio[];
};
