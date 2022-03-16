import { Knex } from "knex";
import fetch from "node-fetch";
import { camelCaseKeys, makeMap } from "../util/helper";
import { Portfolio } from "../util/models";

export class UserService {
	constructor(private knex: Knex) {}

	async getUserByUsername(username: string) {
		return (
			await this.knex("users")
				.select("id", "username", "email", "password", "avatar", "role")
				.where("username", username)
		)[0];
	}

	async getUserByEmail(email: string) {
		return (
			await this.knex("users")
				.select("id", "username", "email", "password", "avatar", "role")
				.where("email", email)
		)[0];
	}

	async addUser(username: string, password: string, email: string) {
		return (
			await this.knex("users")
				.insert({ username, password, email })
				.returning(["id", "username", "email", "avatar", "role"])
		)[0];
	}

	async getGoogleInfo(accessToken: string) {
		const res = await fetch("https://www.googleapis.com/oauth2/v2/userinfo", {
			method: "get",
			headers: {
				Authorization: `Bearer ${accessToken}`,
			},
		});

		const result = await res.json();
		return result;
	}

	async getUserPortfolio(userId: number): Promise<Portfolio[]> {
		const portfolio = await this.queryPortfolio(userId);

		if (portfolio.length > 0) {
			const stockPriceArr = await this.queryStockPrice(userId);
			const stockPriceMap = stockPriceArr.reduce(makeMap, {});

			return portfolio.map((row: any) => ({
				stockId: row.stockId,
				ticker: row.ticker,
				name: row.name,
				price: stockPriceMap[row["stockId"]],
				shares: row.shares,
				avgCost: row.avgCost,
				totalCost: row.totalCost,
				marketValue: (row["shares"] * stockPriceMap[row["stockId"]]).toFixed(2),
				profit: (row["shares"] * stockPriceMap[row["stockId"]] - row["totalCost"]).toFixed(2),
				profitPercentage: `${(
					((row["shares"] * stockPriceMap[row["stockId"]] - row["totalCost"]) / row["totalCost"]) *
					100
				).toFixed(2)}%`,
			}));
		}
		return [];
	}
	// get portfolio
	private async queryPortfolio(userId: number) {
		return camelCaseKeys(
			(
				await this.knex.raw(
					/*sql*/
					`select s.ticker, s.name , p.stock_id,
					sum(p.position_size) shares, 
					round(sum(p.position_size * p.unit_cost) / sum(p.position_size),2) avg_cost,
					round(sum(p.position_size * p.unit_cost), 2) total_cost
					from portfolios p
					join stocks s on p.stock_id = s.id
					join users u on p.user_id = u.id 
					where u.id = ? and p.position_size > 0
					group by s.ticker, s.name, p.stock_id
					order by s.ticker asc`,
					[userId]
				)
			).rows
		);
	}
	//get stock price in portfolio
	private async queryStockPrice(userId: number) {
		return camelCaseKeys(
			(
				await this.knex.raw(
					/*sql*/ `select sp.stock_id, sp.price 
					from stock_prices sp 
				join portfolios p 
				on p.stock_id = sp.stock_id 
				where sp.created_at 
				in (SELECT max(created_at) FROM stock_prices sp limit 1)
				and p.user_id  = ?`,
					[userId]
				)
			).rows
		);
	}
	async updateSetting(username: any, hashedPassword: any, filename: any, userId: number) {
		return camelCaseKeys(
			await this.knex.raw(
				/*sql*/
				`update users set username = COALESCE(?, username),
				password = COALESCE(?, password),
				avatar = COALESCE(?, avatar)
				where id = ?;`,
				[username, hashedPassword, filename, userId]
			)
		);
	}

	async getBalance(userId: number): Promise<{ deposit: string; cash: string }> {
		const balance = await this.knex<{ deposit: string; cash: string }>("user_history")
			.select("deposit", "cash")
			.where("user_id", userId)
			.orderBy("created_at", "desc")
			.limit(1);
		return balance[0];
	}

	async transfer(cash: number, deposit: number, userId: number): Promise<void> {
		await this.knex("user_history").insert({ deposit, cash, user_id: userId });
		return;
	}
}
