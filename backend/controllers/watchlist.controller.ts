import express, { Request } from "express";
import { WatchlistService } from "../services/watchlist.service";
import { wrapControllerMethod } from "../util/helper";
import { HttpError } from "../util/models";

export class WatchlistController {
	constructor(private watchlistService: WatchlistService) {
		this.router.get("/watchlist/all", wrapControllerMethod(this.getAllWatchlistsName));
		this.router.get("/watchlist/:watchlistId", wrapControllerMethod(this.get));
		this.router.post("/watchlist", wrapControllerMethod(this.post));
		this.router.put("/watchlist/:watchlistId", wrapControllerMethod(this.put));
		this.router.delete("/watchlist/:watchlistId", wrapControllerMethod(this.delete));
		this.router.post("/watchlist/:watchlistId/:stockId", wrapControllerMethod(this.addStockToWatchlist));
		this.router.delete("/watchlist/:watchlistId/:stockId", wrapControllerMethod(this.deleteStockFromWatchlist));
	}

	router = express.Router();

	getAllWatchlistsName = async (req: Request) => {
		return await this.watchlistService.getAllWatchlistsName(Number(req.session["user"].id));
	};

	get = async (req: Request) => {
		const watchlistId = Number(req.params.watchlistId);

		if (Number.isNaN(watchlistId)) throw new HttpError(400, "Watchlist not exist");
		return await this.watchlistService.getWatchlist(watchlistId);
	};

	post = async (req: Request) => {
		const name = String(req.body.name).replace(/s+/, "");
		const userId = req.session["user"].id;

		if (!name) throw new HttpError(400, "Watchlist name cannot be empty.");
		return await this.watchlistService.createWatchlist(userId, name);
	};

	put = async (req: Request): Promise<{ message: string }> => {
		const watchlistId = Number(req.params.watchlistId);
		const name = String(req.body.name).replace(/s+/, "");

		if (Number.isNaN(watchlistId)) throw new HttpError(400, "Watchlist not exist");
		if (!name) throw new HttpError(400, "Watchlist name cannot be empty.");
		return await this.watchlistService.changeWatchlistName(watchlistId, name);
	};

	delete = async (req: Request): Promise<{ message: string }> => {
		const watchlistId = Number(req.params.watchlistId);

		if (Number.isNaN(watchlistId)) throw new HttpError(400, "Watchlist not exist");
		return await this.watchlistService.deleteWatchlist(watchlistId);
	};

	addStockToWatchlist = async (req: Request): Promise<{ message: string }> => {
		const watchlistId = Number(req.params.watchlistId);
		const stockId = Number(req.params.stockId);

		if (Number.isNaN(watchlistId)) throw new HttpError(400, "Watchlist not exist");
		return await this.watchlistService.addStock(watchlistId, stockId);
	};

	deleteStockFromWatchlist = async (req: Request): Promise<{ message: string }> => {
		const watchlistId = Number(req.params.watchlistId);
		const stockId = Number(req.params.stockId);

		if (Number.isNaN(watchlistId)) throw new HttpError(400, "Watchlist not exist");
		return await this.watchlistService.deleteStock(watchlistId, stockId);
	};
}
