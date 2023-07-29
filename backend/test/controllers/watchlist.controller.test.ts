import { Request } from "express";
import jwtSimple from "jwt-simple";
import { Knex } from "knex";
import { WatchlistController } from "../../controllers/watchlist.controller";
import { StockService } from "../../services/stock.service";
import { WatchlistService } from "../../services/watchlist.service";
import { Stock } from "../../util/models";
import permit from "../../util/permit";

jest.mock("../../services/watchlist.service");
jest.mock("../../util/permit");
jest.mock("jwt-simple");

describe("WatchlistController", () => {
  let controller: WatchlistController;
  let watchlistService: WatchlistService;
  let stockService: StockService;
  let req: Request;

  beforeEach(function () {
    watchlistService = new WatchlistService({} as Knex);
    watchlistService.getWatchlist = jest.fn((userId) => Promise.resolve([]));
    watchlistService.createWatchlist = jest.fn((userId, name) => Promise.resolve(1));
    watchlistService.changeWatchlistName = jest.fn((watchlistId, name, userId) => Promise.resolve());
    watchlistService.deleteWatchlist = jest.fn((WatchlistId, userId) => Promise.resolve());
    watchlistService.getAllWatchlistsName = jest.fn((userId) => Promise.resolve([{ id: 1, name: "a" }]));
    watchlistService.addStock = jest.fn((watchlistId, stockId) => Promise.resolve());
    watchlistService.deleteStock = jest.fn((watchlistId, stockId) => Promise.resolve());
    stockService = new StockService({} as Knex);
    stockService.getStockInfo = jest.fn((ticker) => Promise.resolve({} as Stock));
    controller = new WatchlistController(watchlistService, stockService);
    req = { body: {}, session: { user: { id: 1 } }, params: {} } as any as Request;
    permit.check as jest.Mock;
    (jwtSimple.decode as jest.Mock).mockReturnValue({ id: 1 });
  });

  describe("GET /watchlist/all", () => {
    test("get all watchlists name", async () => {
      const result = await controller.getAllWatchlistsName(req);
      expect(watchlistService.getAllWatchlistsName).toBeCalled;
      expect(result).toMatchObject([{ id: 1, name: "a" }]);
    });
  });

  describe("GET /watchlist/:watchlistId", () => {
    test("get watchlist", async () => {
      req.params = { watchlistId: "1" };
      const result = await controller.get(req);
      expect(watchlistService.getWatchlist).toBeCalled;
      expect(result).toMatchObject([]);
    });

    test("throw error with string watchlistId", async () => {
      req.params = { watchlistId: "asjkfdsflsd" };
      await expect(controller.get(req)).rejects.toThrowError("Watchlist not exist");
    });

    test("throw error with watchlistId == 0", async () => {
      req.params = { watchlistId: "0" };
      await expect(controller.get(req)).rejects.toThrowError("Watchlist not exist");
    });

    test("throw error with watchlistId < 0", async () => {
      req.params = { watchlistId: "-1" };
      await expect(controller.get(req)).rejects.toThrowError("Watchlist not exist");
    });
  });

  describe("POST /watchlist", () => {
    test("create watchlist", async () => {
      req.body = { name: "a" };
      const result = await controller.post(req);
      expect(watchlistService.createWatchlist).toBeCalled();
      expect(result).toMatchObject({ id: 1, name: "a" });
    });

    test("throw error with empty name", async () => {
      req.body = { name: "        " };
      await expect(controller.post(req)).rejects.toThrowError("Watchlist name cannot be empty");
    });
  });

  describe("PUT /watchlist/:watchlistId", () => {
    test("change watchlist name", async () => {
      req.params = { watchlistId: "1" };
      req.body = { name: "a" };
      const result = await controller.put(req);
      expect(watchlistService.changeWatchlistName).toBeCalled;
      expect(result).toMatchObject({ message: "watchlist name changed to a" });
    });

    test("throw error with wrong watchlistId", async () => {
      req.params = { watchlistId: "" };
      req.body = { name: "        " };
      await expect(controller.put(req)).rejects.toThrowError("Watchlist not exist");
    });

    test("throw error with empty watchlist name", async () => {
      req.params = { watchlistId: "1" };
      req.body = { name: "   " };
      await expect(controller.put(req)).rejects.toThrowError("Watchlist name cannot be empty");
    });
  });

  describe("DELETE /watchlist/:watchlistId", () => {
    test("get all watchlists name", async () => {
      req.params = { watchlistId: "1" };
      const result = await controller.delete(req);
      expect(watchlistService.deleteWatchlist).toBeCalled;
      expect(result).toMatchObject({ message: "watchlist deleted" });
    });

    test("throw error with wrong watchlistId", async () => {
      req.params = { watchlistId: "" };
      await expect(controller.delete(req)).rejects.toThrowError("Watchlist not exist");
    });
  });

  describe("POST /watchlist/:watchlistId/:stockId", () => {
    test("get all watchlists name", async () => {
      req.params = { watchlistId: "1", stockId: "1" };
      const result = await controller.addStock(req);
      expect(watchlistService.addStock).toBeCalled;
      expect(result).toMatchObject({});
    });

    test("throw error with wrong watchlistId", async () => {
      req.params = { watchlistId: "", stockId: "" };
      await expect(controller.addStock(req)).rejects.toThrowError("Watchlist not exist");
    });
  });

  describe("DELETE /watchlist/:watchlistId/:stockId", () => {
    test("get all watchlists name", async () => {
      req.params = { watchlistId: "1", stockId: "1" };

      const result = await controller.deleteStock(req);
      expect(watchlistService.deleteStock).toBeCalled;
      expect(result).toMatchObject({ message: "stock deleted" });
    });

    test("throw error with wrong watchlistId", async () => {
      req.params = { watchlistId: "", stockId: "" };
      await expect(controller.delete(req)).rejects.toThrow("Watchlist not exist");
    });
  });
});
