import { Stock } from "../stocks/state";

export type Item = {
	id?: number;
	name: string;
	isInclude?: boolean;
};

export type ScreenerState = {
	industries: Item[];
	sectors: Item[];
	stocks: Stock[];
	addedIndustries: Item[];
	addedSectors: Item[];
	isLoading: boolean;
};
