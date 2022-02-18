import { Knex } from "knex";
import { camelCaseKeys } from "../util/helper";

export class StockService {
	constructor(private knex: Knex) {}

	async getStockInfo(ticker: string) {
		let stockArr:any[] = camelCaseKeys(
			await this.knex("stocks as s")
				.select(
					"s.id",
					"s.ticker",
					"sp.price",
					"s.name as stock_name",
					"i.name as industry_name",
					"sec.name as sector_name"
				)
				.join("industries as i", "s.industry_id", "i.id")
				.join("sectors as sec", "s.sector_id", "sec.id")
				.join("stock_prices as sp", "s.id", "sp.stock_id")
				.where("s.ticker", "=", ticker)
				.orderBy("sp.created_at", "desc")
				.limit(2)
		);
		if (stockArr.length) {
			return {
				id: stockArr[0].id,
				ticker: stockArr[0].ticker,
				name: stockArr[0].stockName,
				price: stockArr[0].price,
				prevPrice: stockArr[1].price,
				industryName: stockArr[0].industryName,
				sectorName: stockArr[0].sectorName,
			};
		} else return;
	}
}
