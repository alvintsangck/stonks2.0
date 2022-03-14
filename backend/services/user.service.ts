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
		let queryPortfolioArr = await this.queryPortfolio(userId);

		let stockMap = queryPortfolioArr.reduce((prev: {}, next: {}) => {
			prev[next["ticker"]] = next["stockId"];
			return prev;
		}, {});

		let queryString = "";
		for (let ticker in stockMap) {
			queryString += `sp.stock_id = ${stockMap[ticker]} or `;
		}

		let stockPriceArr = await this.queryStockPrice(queryString.slice(0, -4));
		let stockPriceMap = stockPriceArr.reduce(makeMap, {});

		return queryPortfolioArr.map((row: any) => {
			return {
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
			};
		});
	}
	// get portfolio
	async queryPortfolio(userId: number) {
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
					where u.id = ?
					group by s.ticker, s.name, p.stock_id
					order by s.ticker asc`,
					[userId]
				)
			).rows
		);
	}
	//get stock price in portfolio
	async queryStockPrice(queryString: string) {
		return camelCaseKeys(
			(
				await this.knex.raw(/*sql*/ `select sp.stock_id, sp.price 
				from stock_prices sp 
				where created_at 
				in (SELECT max(created_at) FROM stock_prices sp limit 1)
				and (${queryString})`)
			).rows
		);
	}
	async updateSetting(username: string, hashedPassword: any, filename: any, userId: number) {
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

	async getBalance(userId: number): Promise<{ deposit: number; cash: number }> {
		const balance = await this.knex<{ deposit: number; cash: number }>("user_history")
			.select("deposit", "cash")
			.where("user_id", userId)
			.orderBy("created_at", "desc")
			.limit(1);
		return balance[0];
	}
}
