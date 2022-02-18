import { Knex } from "knex";
import { camelCaseKeys } from "../util/helper";

export class WatchlistService {
	constructor(private knex: Knex) {}

	async getWatchlist(userId: number): Promise<any[]> {
		return createArr(await this.queryWatchlist(userId));
	}

	async createWatchlist(userId: number, name: string): Promise<number> {
		return (await this.knex("watchlists").insert({ user_id: userId, name }).returning(["id"]))[0];
	}

	async changeWatchlistName(watchlistId: number, name: string): Promise<{ message: string }> {
		await this.knex("watchlist").update(name).where({ id: watchlistId });
		return { message: `watchlist name changed to ${name}` };
	}

	async deleteWatchlist(watchlistId: number): Promise<{ message: string }> {
		await this.knex("watchlists").delete().where("id", watchlistId);
		return { message: "watchlist deleted" };
	}

	async getAllWatchlistsName(userId: number): Promise<string[]> {
		return await this.knex("watchlists").select("id", "name").where("user_id", userId);
	}

	async addStock(watchlistId: number, stockId: number): Promise<{ message: string }> {
		await this.knex("watchlist_stock").insert({ watchlist_id: watchlistId, stock_id: stockId });
		return { message: `${stockId} added to watchlist ${watchlistId}` };
	}

	async deleteStock(watchlistId: number, stockId: number): Promise<{ message: string }> {
		await this.knex("watchlist_stock as ws")
			.delete()
			.where("ws.stock_id", stockId)
			.where("ws.watchlist_id", watchlistId);
		return { message: "stock deleted" };
	}

	async searchWatchlist(userId: number, watchlistId: number, stockId: number): Promise<any> {
		return (
			await this.knex("watchlist_stock as ws")
				.select("ws.stock_id")
				.join("watchlists as w", "w.id", "ws.watchlist_id")
				.join("users as u", "w.user_id", "u.id")
				.where("u.id", userId)
				.where("ws.stock_id", stockId)
				.where("w.id", watchlistId)
		)[0];
	}

	async queryWatchlist(watchlistId: number): Promise<any> {
		return camelCaseKeys(
			(
				await this.knex.raw(
					/*sql*/ `select s.ticker, s.id stock_id, s.name stock_name, sp.price, sp.created_at
				from watchlist_stock ws 
				join stocks s on s.id = ws.stock_id
				join stock_prices sp on sp.stock_id = s.id 
				where sp.created_at 
				in (SELECT distinct created_at FROM stock_prices sp order by created_at desc limit 2) 
				and ws.watchlist_id = ?
				order by ticker, created_at`,
					[watchlistId]
				)
			).rows
		);
	}
}

function createArr(queryArr: any[]): any[] {
	let watchlistArr: any[] = [];
	for (let i = 0; i < queryArr.length; i += 2) {
		watchlistArr.push({
			id: queryArr[i].id,
			stockId: queryArr[i].stockId,
			name: queryArr[i].stockName,
			ticker: queryArr[i].ticker,
			prevPrice: queryArr[i].price,
			price: queryArr[i + 1].price,
		});
	}
	return watchlistArr;
}
