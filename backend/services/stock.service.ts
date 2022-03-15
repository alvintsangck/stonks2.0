import { Knex } from "knex";
import { camelCaseKeys } from "../util/helper";
import { Stock } from "../util/models";

export class StockService {
	constructor(private knex: Knex) {}

	async getStockInfo(ticker: string): Promise<Stock[]> {
		const stockArr: Stock[] = camelCaseKeys(
			await this.knex("stocks as s")
				.select("s.id", "s.ticker", "s.name", "sp.price", "se.name as sector_name", "i.name as industry_name")
				.leftJoin("stock_prices as sp", "s.id", "sp.stock_id")
				.join("sectors as se", "s.sector_id", "se.id")
				.leftJoin("industries as i", "s.industry_id", "i.id")
				.where("s.ticker", ticker)
				.orderBy("sp.created_at", "desc")
				.limit(2)
		);

		return stockArr;
	}

	async getCash(userId: number): Promise<number> {
		const cash = await this.knex<{ cash: number }>("user_history")
			.select("cash")
			.where("user_id", userId)
			.orderBy("created_at", "desc")
			.limit(1);
		return cash[0].cash;
	}

	async getShare(ticker: string, userId: number): Promise<number> {
		const shares = this.knex<{ shares: number }>("portfolios as p")
			.sum("p.position_size")
			.join("stocks as s", "p.stock_id", "s.id")
			.where("p.user_id", userId)
			.where("s.ticker", ticker);

		return shares[0].shares;
	}

	async trade(userId: number, stockId: number, share: number, price: number, cash: number): Promise<void | unknown> {
		const txn = await this.knex.transaction();

		try {
			await txn("portfolios").insert({
				user_id: userId,
				stock_id: stockId,
				position_size: share,
				unit_cost: price,
			});
			await txn("user_history").insert({ user_id: userId, cash });
			await txn.commit();
			return;
		} catch (error) {
			await txn.rollback();
			return error;
		}
	}
}
