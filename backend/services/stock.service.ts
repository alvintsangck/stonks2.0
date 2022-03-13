import { Knex } from "knex";
import { camelCaseKeys } from "../util/helper";
import { Stock } from "../util/models";

export class StockService {
	constructor(private knex: Knex) {}

	async getStockInfo(ticker: string): Promise<Stock | null> {
		let stockArr: any[] = camelCaseKeys(
			await this.knex("stocks as s").select("s.id", "s.ticker", "s.name").where("s.ticker", "=", ticker)
		);
		if (stockArr.length) {
			return {
				id: stockArr[0].id,
				ticker: stockArr[0].ticker,
				name: stockArr[0].stockName,
			};
		} else return null;
	}
}
