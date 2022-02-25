import camelcaseKeys from "camelcase-keys";
import { Knex } from "knex";
import fetch from "node-fetch";
import { camelCaseKeys, makeMap } from "../util/helper";

export class UserService {
	constructor(private knex: Knex) {}

	async getUserByUsername(username: string) {
		return (
			await this.knex("users")
				.select("id", "username", "email", "password", "avatar", "role", "deposit", "cash")
				.where("username", username)
		)[0];
	}

	async getUserByEmail(email: string) {
		return (
			await this.knex("users")
				.select("id", "username", "email", "password", "avatar", "role", "deposit", "cash")
				.where("email", email)
		)[0];
	}

	async addUser(username: string, password: string, email: string) {
		return (
			await this.knex("users")
				.insert({ username, password, email })
				.returning(["id", "username", "email", "avatar", "role", "deposit", "cash"])
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

	async getUserPortfolio(userId: number) {
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

		return queryPortfolioArr.map((row: {}) => {
			return {
				...row,
				price: stockPriceMap[row["stockId"]],
				marketValue: (row["shares"] * stockPriceMap[row["stockId"]]).toFixed(2),
				profit: (row["shares"] * stockPriceMap[row["stockId"]] - row["totalCost"]).toFixed(2),
				profitPercentage: `${(
					((row["shares"] * stockPriceMap[row["stockId"]] - row["totalCost"]) / row["totalCost"]) *
					100
				).toFixed(2)}%`,
			};
		});
	}

	async queryPortfolio(userId: number) {
		return camelCaseKeys(
			(
				await this.knex.raw(
					/*sql*/
					`select s.ticker, s.name stock_name, p.stock_id,
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

	async queryUserCash(userId: number) {
		return camelcaseKeys(
			await this.knex.raw(
				/*sql*/
				`select h.cash, h.deposit, h.created_at
					from user_history u
					join users u on h.user_id=u.id
					where u.id = ?
					order by h.created_at desc`[userId]
			)
		).rows;
	}

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
		console.log("username", username);

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

	async tradeStockServ(userId: number, ticker: string, price: number, share: number) {
		let stockId = await this.knex("stocks").select("id").where("ticker", "=", ticker);
		console.log("service", stockId, userId, price, share);

		await this.knex("portfolios").insert({
			user_id: userId,
			stock_id: stockId[0]["id"],
			position_size: share,
			unit_cost: price,
		});
		return;
	}
}

// .join("users", "portfolios.user_id", "users.id")
// .join("stocks", "portfolios.stock_id", "stocks.id")
// .join("industries", "stocks.industry_id", "industries.id")
// .join("sectors", "stocks.sector_id", "sectors.id")
// .select(this.knex.raw("sum(portfolios.position_size *portfolios.unit_cost) as cost"),"stocks.ticker", "stocks.name as stockName", "portfolios.position_size", "portfolios.unit_cost")
// .where("users.id", "=", userId)
// .orderBy("stocks.ticker", "asc")
