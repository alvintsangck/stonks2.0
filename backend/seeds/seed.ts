import { Knex } from "knex";
import xlsx from "xlsx";
import { hashPassword } from "../util/hash";
import { logger } from "../util/logger";
import {
	Industry,
	RawIndustryData,
	RawStockData,
	Sector,
	SectorData,
	StockData,
	UserData,
	UserComment,
	PortfolioData,
	IndustryData,
} from "../util/models";

export async function seed(knex: Knex): Promise<void> {
	let workbook = xlsx.readFile("./seeds/data.xlsx");
	let sectorData: SectorData[] = xlsx.utils.sheet_to_json(workbook.Sheets["sectors"]);
	let rawIndustryData: RawIndustryData[] = xlsx.utils.sheet_to_json(workbook.Sheets["industries"]);
	let rawStockData: RawStockData[] = xlsx.utils.sheet_to_json(workbook.Sheets["stocks"]);
	let userData: UserData[] = xlsx.utils.sheet_to_json(workbook.Sheets["users"]);
	let portfolioData: PortfolioData[] = xlsx.utils.sheet_to_json(workbook.Sheets["portfolios"]);
	let commentData: UserComment[] = xlsx.utils.sheet_to_json(workbook.Sheets["comments"]);
	let watchlistData = xlsx.utils.sheet_to_json(workbook.Sheets["watchlists"]);
	let watchlistStockData = xlsx.utils.sheet_to_json(workbook.Sheets["watchlistStock"]);

	for (let user of userData) {
		user.password = await hashPassword(user.password!.toString());
	}

	let txn = await knex.transaction();
	try {
		// Deletes ALL existing entries
		let t1 = Date.now();
		await txn("watchlist_stock").del();
		await txn.raw(`ALTER SEQUENCE watchlist_stock_id_seq RESTART`);

		await txn("industry_rs").del();
		await txn.raw(`ALTER SEQUENCE industry_rs_id_seq RESTART`);

		await txn("stock_rs").del();
		await txn.raw(`ALTER SEQUENCE stock_rs_id_seq RESTART`);

		await txn("watchlists").del();
		await txn.raw(`ALTER SEQUENCE watchlists_id_seq RESTART`);

		await txn("stock_prices").del();
		await txn.raw(`ALTER SEQUENCE stock_prices_id_seq RESTART`);

		await txn("portfolios").del();
		await txn.raw(`ALTER SEQUENCE portfolios_id_seq RESTART`);

		await txn("comments").del();
		await txn.raw(`ALTER SEQUENCE comments_id_seq RESTART`);

		await txn("users").del();
		await txn.raw(`ALTER SEQUENCE users_id_seq RESTART`);

		await txn("stocks").del();
		await txn.raw(`ALTER SEQUENCE stocks_id_seq RESTART`);

		await txn("industries").del();
		await txn.raw(`ALTER SEQUENCE industries_id_seq RESTART`);

		await txn("sectors").del();
		await txn.raw(`ALTER SEQUENCE sectors_id_seq RESTART`);
		let t2 = Date.now();

		// Inserts seed entries
		const sectorArr: Sector[] = await txn("sectors").insert(sectorData).returning(["id", "name"]);
		const sectorMap = sectorArr.reduce(makeMap, {});
		let industryData: IndustryData[] = rawIndustryData.map((row): IndustryData => {
			let { sector, ...industryObj } = row;
			industryObj["sector_id"] = sectorMap[sector];
			return industryObj;
		});

		const industryIDs: Industry[] = await txn("industries").insert(industryData).returning(["id", "name", "sector_id"]);
		let stockData: StockData[] = [];
		for (let stock of rawStockData) {
			for (let industry of industryIDs) {
				if (stock.industry_name == industry.name) {
					stock.industry_id = industry.id;
					stock.sector_id = industry.sector_id;
				}
			}
			let { industry_name, ...formattedStock } = stock;
			stockData.push(formattedStock);
		}
		let stockArr = await txn("stocks").insert(stockData).returning(["id", "ticker"]);
		//@ts-ignore
		let stockMap = stockArr.reduce(makeMap, {});
		// let t3 = Date.now();
		// for (let i = 0; i < 45; i++) {
		// 	logger.debug(`reading chunk ${i}`);
		// 	workbook = xlsx.readFile(`./seeds/import/chunk${i}.xlsx`);
		// 	let chunkData = xlsx.utils.sheet_to_json(workbook.Sheets["Sheet1"]);
		// 	logger.debug(`finished read chunk ${i}`);

		// 	let stockPriceData = chunkData.map((row: any) => {
		// 		let obj = {};
		// 		let { ticker, price, date } = row;

		// 		ticker = ticker.toString().toUpperCase();
		// 		obj["stock_id"] = Number(stockMap[ticker]);
		// 		obj["price"] = price;
		// 		obj["created_at"] = excelDateToJSDate(date);
		// 		obj["updated_at"] = excelDateToJSDate(date);
		// 		return obj;
		// 	});
		// 	await txn.batchInsert("stock_prices", stockPriceData, 15000);
		// 	logger.debug("finished insert ", i + 1);
		// }
		// let t4 = Date.now();

		await txn("users").insert(userData);
		await txn("comments").insert(commentData);
		await txn("portfolios").insert(portfolioData);
		await txn("watchlists").insert(watchlistData);
		await txn("watchlist_stock").insert(watchlistStockData);
		await txn("user_history").insert([{ user_id: 1 }]);
		await txn("user_history").insert([{ user_id: 2 }]);
		await txn("user_history").insert([{ user_id: 3 }]);

		await txn.commit();
		logger.debug(`delete all data in ${(t2 - t1) / 1000}s`);
		// logger.debug(`insert chunk data in ${(t4 - t3) / 1000}s`);

		return;
	} catch (e) {
		await txn.rollback();
		console.log(e);
		return;
	}
}

function makeMap(obj: {}, obj2: {}): {} {
	let keyArr = Object.keys(obj2);
	obj[obj2[keyArr[1]]] = obj2[keyArr[0]].toString();
	return obj;
}

export function excelDateToJSDate(serial: number) {
	let utc_days = Math.floor(serial - 25569);
	let utc_value = utc_days * 86400;
	let date_info = new Date(utc_value * 1000);

	let fractional_day = serial - Math.floor(serial) + 0.0000001;
	let total_seconds = Math.floor(86400 * fractional_day);
	let seconds = total_seconds % 60;
	total_seconds -= seconds;

	let hours = Math.floor(total_seconds / (60 * 60));
	let minutes = Math.floor(total_seconds / 60) % 60;

	return new Date(date_info.getFullYear(), date_info.getMonth(), date_info.getDate(), hours, minutes, seconds);
}
