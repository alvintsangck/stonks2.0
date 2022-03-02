export type Stock = {
    id: number;
	ticker: string;
	name: string;
	price: number;
	prevPrice?: number;
    sectorName?: string;
    industryName?: string;
}