import { Knex } from "knex";
import { StockController } from "../../controllers/stock.controller";
import { StockService } from "../../services/stock.service";
import { Request } from "express";
import { UserService } from "../../services/user.service";

jest.mock("../../services/stock.service");

describe("StockController", () => {
	let controller: StockController;
	let stockService: StockService;
	let userService: UserService
	let req: Request;

	beforeEach(function () {
		stockService = new StockService({} as Knex);
		stockService.getStockInfo = jest.fn((ticker) =>
			Promise.resolve({
				id: 1,
				ticker: "A",
				name: "a",
				price: 1,
				prevPrice: 0,
				industryName: "i",
				sectorName: "s",
			})
		);

		controller = new StockController(stockService, userService);
		req = {
			params: {},
		} as any as Request;
	});

	describe("GET /Stock", () => {
		test("get stock info", async () => {
			req.params = { ticker: "a" };
			const result = await controller.getStockInfo(req);
			expect(stockService.getStockInfo).toBeCalled();
			expect(result).toMatchObject({
				id: 1,
				ticker: "A",
				name: "a",
				price: 1,
				prevPrice: 0,
				industryName: "i",
				sectorName: "s",
			});
		});

		test("throw error if invalid ticker", async () => {
			req.params = { ticker: "" };
			stockService.getStockInfo = jest.fn(() => Promise.resolve(null));
			await expect(controller.getStockInfo(req)).rejects.toThrow("Invalid ticker");
		});

		test("throw error if no stock found", async () => {
			req.params = { ticker: "abc" };
			stockService.getStockInfo = jest.fn(() => Promise.resolve(null));
			await expect(controller.getStockInfo(req)).rejects.toThrow("Stock not found");
			expect(stockService.getStockInfo).toBeCalled();
		});
	});
});
