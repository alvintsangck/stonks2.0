import express, { Request } from "express";
import { StockService } from "../services/stock.service";
import { HttpError } from "../util/models";
import yahooFinance from "yahoo-finance2";
import { wrapControllerMethod } from "../util/helper";

export class StockController {
	constructor(private stockService: StockService) {
		this.router.get("/stocks/:ticker", wrapControllerMethod(this.getStockInfo));
		this.router.get("/stocks/:ticker/price", wrapControllerMethod(this.getStockPrice));
		this.router.get("/stocks/:ticker/news", wrapControllerMethod(this.getStockNews));
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
}
