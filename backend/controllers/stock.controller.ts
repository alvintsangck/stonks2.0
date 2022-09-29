import express, { Request } from "express";
import yahooFinance from "yahoo-finance2";
import { isLoggedIn } from "../middlewares/guard";
import { StockService } from "../services/stock.service";
import { getUser, wrapControllerMethod } from "../util/helper";
import { logger } from "../util/logger";
import { HttpError, Stock } from "../util/models";

export class StockController {
  constructor(private stockService: StockService) {
    this.router.get("/stocks/:ticker", wrapControllerMethod(this.getStockInfo));
    this.router.get("/stocks/:ticker/shares", wrapControllerMethod(this.getShares));
    this.router.get("/stocks/:ticker/news", wrapControllerMethod(this.getStockNews));
    this.router.post("/stocks/:ticker/buy", isLoggedIn, wrapControllerMethod(this.buy));
    this.router.post("/stocks/:ticker/sell", isLoggedIn, wrapControllerMethod(this.sell));
  }

  router = express.Router();

  getStockInfo = async (req: Request): Promise<Stock> => {
    const ticker = String(req.params.ticker).toUpperCase();
    if (!ticker.match(/[a-zA-z]/g)) throw new HttpError(400, "Invalid ticker");
    const stock = await this.stockService.getStockInfo(ticker);

    if (!stock) throw new HttpError(400, "Stock not found");
    return stock;
  };

  getShares = async (req: Request) => {
    const user = getUser(req);

    const ticker = String(req.params.ticker).toUpperCase();
    if (!ticker.match(/[a-zA-z]/g)) throw new HttpError(400, "Invalid ticker");

    const shares = await this.stockService.getShare(ticker, user.id);
    return { shares };
  };

  getStockNews = async (req: Request) => {
    const ticker = String(req.params.ticker).toUpperCase();
    if (!ticker.match(/[a-zA-z]/g)) throw new HttpError(400, "Invalid ticker");

    try {
      const news = (await yahooFinance.search(ticker, { newsCount: 10 })).news;
      return news;
    } catch (error) {
      logger.error(error);
      return [];
    }
  };

  buy = async (req: Request): Promise<{ cash: number; shares: number }> => {
    const user = getUser(req);
    const ticker = String(req.params.ticker).toUpperCase();
    if (!ticker.match(/[a-zA-z]/g)) throw new HttpError(400, "Invalid ticker");

    const stock = await this.getStockInfo(req);

    const shares = Number(req.body.shares);
    if (Number.isNaN(shares) || shares <= 0) throw new HttpError(400, "Share number must be positive");

    const price = Number(req.body.price);
    if (Number.isNaN(price) || price <= 0) throw new HttpError(400, "Price must be positive");

    const cash = await this.stockService.getCash(user.id);
    const cost = price * shares;
    if (cost > cash) throw new HttpError(400, "Not enough cash");

    const remainingCash = cash - cost;
    const error = await this.stockService.trade(user.id, stock.id, shares, price, remainingCash);
    if (error) throw error;

    const ownedShares = await this.stockService.getShare(ticker, user.id);

    return { cash: remainingCash, shares: ownedShares };
  };

  sell = async (req: Request): Promise<{ cash: number; shares: number }> => {
    const user = getUser(req);

    const ticker = String(req.params.ticker).toUpperCase();
    if (!ticker.match(/[a-zA-z]/g)) throw new HttpError(400, "Invalid ticker");

    const stock = await this.getStockInfo(req);

    const shares = Number(req.body.shares);
    if (Number.isNaN(shares) || shares <= 0) throw new HttpError(400, "Share number must be positive");

    const ownedShares = await this.stockService.getShare(ticker, user.id);

    if (shares > ownedShares) throw new HttpError(400, "Not enough shares");

    const price = Number(req.body.price);
    if (Number.isNaN(price) || price <= 0) throw new HttpError(400, "Price must be positive");

    const profit = price * shares;
    const cash = await this.stockService.getCash(user.id);

    const remainingCash = cash + profit;
    const error = await this.stockService.trade(user.id, stock.id, -shares, price, remainingCash);
    if (error) throw error;

    return { cash: remainingCash, shares: ownedShares - shares };
  };
}
