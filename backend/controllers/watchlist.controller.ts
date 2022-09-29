import express, { Request } from "express";
import { StockService } from "../services/stock.service";
import { WatchlistService } from "../services/watchlist.service";
import { getUser, wrapControllerMethod } from "../util/helper";
import { HttpError, Stock } from "../util/models";

export class WatchlistController {
  constructor(private watchlistService: WatchlistService, private stockService: StockService) {
    this.router.get("/watchlist/all", wrapControllerMethod(this.getAllWatchlistsName));
    this.router.get("/watchlist/:watchlistId", wrapControllerMethod(this.get));
    this.router.post("/watchlist", wrapControllerMethod(this.post));
    this.router.put("/watchlist/:watchlistId", wrapControllerMethod(this.put));
    this.router.delete("/watchlist/:watchlistId", wrapControllerMethod(this.delete));
    this.router.post("/watchlist/:watchlistId/:ticker", wrapControllerMethod(this.addStock));
    this.router.delete("/watchlist/:watchlistId/:stockId", wrapControllerMethod(this.deleteStock));
  }

  router = express.Router();

  getAllWatchlistsName = async (req: Request): Promise<{ id: number; name: string }[]> => {
    const user = getUser(req);
    if (user.id <= 0) throw new HttpError(400, "User not exist");

    return await this.watchlistService.getAllWatchlistsName(user.id);
  };

  get = async (req: Request): Promise<Stock[]> => {
    const watchlistId = Number(req.params.watchlistId);

    if (Number.isNaN(watchlistId) || watchlistId <= 0) throw new HttpError(400, "Watchlist not exist");

    return await this.watchlistService.getWatchlist(watchlistId);
  };

  post = async (req: Request): Promise<{ id: number; name: string }> => {
    const user = getUser(req);

    const name = String(req.body.name).replace(/\s+/g, "");
    if (name === "") throw new HttpError(400, "Watchlist name cannot be empty");

    const id = await this.watchlistService.createWatchlist(user.id, name);
    return { id, name };
  };

  put = async (req: Request): Promise<{ message: string }> => {
    const user = getUser(req);
    const watchlistId = Number(req.params.watchlistId);
    if (Number.isNaN(watchlistId) || watchlistId <= 0) throw new HttpError(400, "Watchlist not exist");

    const name = String(req.body.name).replace(/\s+/g, "");
    if (!name) throw new HttpError(400, "Watchlist name cannot be empty");

    await this.watchlistService.changeWatchlistName(watchlistId, name, user.id);
    return { message: `watchlist name changed to ${name}` };
  };
  //need to check userId
  delete = async (req: Request): Promise<{ message: string }> => {
    const user = getUser(req);
    const watchlistId = Number(req.params.watchlistId);
    if (Number.isNaN(watchlistId) || watchlistId <= 0) throw new HttpError(400, "Watchlist not exist");

    await this.watchlistService.deleteWatchlist(watchlistId, user.id);
    return { message: "watchlist deleted" };
  };
  //need to check userId
  addStock = async (req: Request): Promise<Stock> => {
    const watchlistId = Number(req.params.watchlistId);
    const ticker = req.params.ticker;
    const stock = await this.stockService.getStockInfo(ticker);
    if (!stock) throw new HttpError(400, "Stock not found");

    const stockId = stock?.id;
    if (Number.isNaN(watchlistId) || watchlistId <= 0) throw new HttpError(400, "Watchlist not exist");

    const result = await this.watchlistService.getStock(watchlistId, stockId);
    if (result) throw new HttpError(400, "Stock already exist");

    await this.watchlistService.addStock(watchlistId, stockId);
    return stock;
  };
  //need to check userId
  deleteStock = async (req: Request): Promise<{ message: string }> => {
    // const user = getUser(req);
    const watchlistId = Number(req.params.watchlistId);
    if (Number.isNaN(watchlistId) || watchlistId <= 0) throw new HttpError(400, "Watchlist not exist");

    const stockId = Number(req.params.stockId);
    if (stockId <= 0) throw new HttpError(400, "Stock not found");

    await this.watchlistService.deleteStock(watchlistId, stockId);
    return { message: "stock deleted" };
  };
}
