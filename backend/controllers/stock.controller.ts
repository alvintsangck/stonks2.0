import express, { Request } from "express";
import { StockService } from "../services/stock.service";
import { HttpError } from "../util/models";
import yahooFinance from "yahoo-finance2";
import { wrapControllerMethod } from "../util/helper";
import { UserService } from "../services/user.service";
import { isLoggedIn } from "../middlewares/guard";

export class StockController {
	constructor(private stockService: StockService, private userService: UserService) {
		this.router.get("/stocks/:ticker", wrapControllerMethod(this.getStockInfo));
		this.router.get("/stocks/:ticker/price", wrapControllerMethod(this.getStockPrice));
		this.router.get("/stocks/:ticker/news", wrapControllerMethod(this.getStockNews));
		this.router.post("/stocks/:ticker/trade", isLoggedIn, this.trade);
	}

	router = express.Router();

	getStockInfo = async (req: Request) => {
		const ticker: string = String(req.params.ticker).toUpperCase();
		if (!ticker.match(/[a-zA-z]/g)) throw new HttpError(400, "Invalid ticker");
		const stock = await this.stockService.getStockInfo(ticker);
		if (!stock) throw new HttpError(400, "Stock not found");
		return stock;
	};

	getStockNews = async (req: Request) => {
		const ticker: string = String(req.params.ticker).toUpperCase();
		if (!ticker.match(/[a-zA-z]/g)) throw new HttpError(400, "Invalid ticker");
		const news = (await yahooFinance.search(ticker, { newsCount: 10 })).news;
		return news;
	};

	getStockPrice = async (req: Request) => {
		const ticker: string = String(req.params.ticker).toUpperCase();
		if (!ticker.match(/[a-zA-z]/g)) throw new HttpError(400, "Invalid ticker");
		return await yahooFinance.quote(ticker);
	};

	trade = async (req: Request) => {
		let portfolio = await this.userService.getUserPortfolio(Number(req.session["user"].id));
		let { ticker, price, share, status } = req.body;
		console.log("received", status);

		if (Number(share) == 0 || !Number.isInteger(Number(share))) {
			throw new HttpError(400, "Number must be an integer greater than zero.");
		}
		if (status === "sell") {
			let sellShare = Number(share);
			if (portfolio.shares - sellShare < 0) {
				throw new HttpError(400, "Sell more than portfolio have");
			}
			share = share * -1;
		} else if (status === "buy") {
			let buyPrice = parseInt(price);
			let buyStock = parseInt(share);
			if (buyPrice * buyStock > portfolio.cash) {
				throw new HttpError(400, "not enough cash");
			}
		}
		await this.userService.tradeStockServ(Number(req.session["user"].id), ticker, price, share);
		return;
	};
}
