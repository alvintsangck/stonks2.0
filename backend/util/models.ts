export class HttpError extends Error {
	constructor(public status: number, public message: string) {
		super(message);
	}
}

export type User = {
	id: number;
	username: string;
	email: string;
	password?: string;
	avatar: string;
	role: string;
	balance: number;
};

export type GoogleInfo = {
	id: string;
	email: string;
	verified_email: boolean;
	name: string;
	given_name: string;
	family_name: string;
	picture: string;
	locale: string;
};

export type Sector = {
	id: number;
	name: string;
};

export type Industry = {
	id: number;
	name: string;
	sector_id: number;
};

export type Stock = {
	id: number;
	name: string;
	industry_id: number;
	sector_id: number;
};

export type UserComment = {
	userId: number;
	stockId: number;
	content: string;
	avatar?: string;
};

// for xlsx Data
export type UserData = Omit<User, "id"> & { email: string };
export type SectorData = Omit<Sector, "id">;
export type IndustryData = Omit<Industry, "id">;
export type StockData = Omit<Stock, "id">;
export type RawIndustryData = {
	name: string;
	sector: string;
	sector_id: number;
};
export type RawStockData = {
	name: string;
	industry_name: string;
	market_cap: number;
	industry_id: number;
	sector_id: number;
};

export type PortfolioData = {
	user_id: number;
	stock_id: number;
	position_size: number;
	unit_cost: number;
};
