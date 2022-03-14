import { Knex } from "knex";
import { camelCaseKeys } from "../util/helper";
import { Stock } from "../util/models";

export class StockService {
	constructor(private knex: Knex) {}

	async getStockInfo(ticker: string): Promise<Stock | null> {
		let stockArr: any[] = camelCaseKeys(
			await this.knex("stocks as s")
				.select("s.id", "s.ticker", "s.name", "sp.price")
				.leftOuterJoin("stock_prices as sp", "s.id", "sp.stock_id")
				.where("s.ticker", "=", ticker)
				.orderBy("sp.created_at", "desc")
				.limit(2)
		);

		if (stockArr.length) {
			return {
				id: stockArr[0].id,
				ticker: stockArr[0].ticker,
				name: stockArr[0].name,
				price: stockArr[0].price,
				prevPrice: stockArr[1].price,
			};
		} else return null;
	}
}
