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
		
		await txn("dim_dates").del();
		await txn.raw(`ALTER SEQUENCE dim_dates_id_seq RESTART`);

		await txn("portfolios").del();
		await txn.raw(`ALTER SEQUENCE portfolios_id_seq RESTART`);

		await txn("comments").del();
		await txn.raw(`ALTER SEQUENCE comments_id_seq RESTART`);

		await txn("user_history").del();
		await txn.raw(`ALTER SEQUENCE user_history_id_seq RESTART`);

		await txn("users").del();
		await txn.raw(`ALTER SEQUENCE users_id_seq RESTART`);

		await txn("stocks").del();
		await txn.raw(`ALTER SEQUENCE stocks_id_seq RESTART`);

		await txn("industries").del();
		await txn.raw(`ALTER SEQUENCE industries_id_seq RESTART`);

		await txn("sectors").del();
		await txn.raw(`ALTER SEQUENCE sectors_id_seq RESTART`);

		// Inserts seed entries
		const sectorArr: Sector[] = await txn("sectors").insert(sectorData).returning(["id", "name"]);
		const sectorMap = sectorArr.reduce(makeMap, {});
		let industryData: IndustryData[] = rawIndustryData.map((row): IndustryData => {
			let { sector, ...industryObj } = row;
			industryObj["sector_id"] = sectorMap[sector];
			return industryObj;
		});

		const industryIDs: Industry[] = await txn("industries")
			.insert(industryData)
			.returning(["id", "name", "sector_id"]);
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
		let dateArr = getDates(new Date(2021,1,1), new Date(2023,1,1))
		await txn("dim_dates").insert(dateArr)

		let newDateArr: any = []

		for (let i = 0; i < dateArr.length; i++){
			let date = new Date(dateArr[i]["year"], dateArr[i]["month"] , dateArr[i]["day"])
			newDateArr.push(date)
		}

		for (let i = 0; i < 4; i++) {
			logger.debug(`reading chunk ${i}`);
			workbook = xlsx.readFile(`../data/import/chunk${i}.xlsx`);
			let chunkData = xlsx.utils.sheet_to_json(workbook.Sheets["Sheet1"]);
			//@ts-ignore
			let stockPriceData = chunkData.map((row: any) => {
				let obj = {};
				let { ticker, price, date } = row;

				ticker = ticker.toString().toUpperCase();
				let psqlDate = excelDateToJSDate(date)
				// console.log(psqlDate);
				obj["stock_id"] = Number(stockMap[ticker]);
				obj["price"] = price;
				obj["date_id"] = newDateArr.map(Number).indexOf(+psqlDate) + 1
				obj["created_at"] = psqlDate
				return obj;
			});
			await txn.batchInsert("stock_prices", stockPriceData, 10000);
			logger.debug(`finished insert chunk ${i}`);
		}

		await txn("users").insert(userData);
		await txn("comments").insert(commentData);
		await txn("portfolios").insert(portfolioData);
		await txn("watchlists").insert(watchlistData);
		await txn("watchlist_stock").insert(watchlistStockData);
		await txn("user_history").insert([{ user_id: 1 }]);
		await txn("user_history").insert([{ user_id: 2 }]);
		await txn("user_history").insert([{ user_id: 3 }]);

		await txn.commit();

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

	// let fractional_day = serial - Math.floor(serial) + 0.0000001;
	// let total_seconds = Math.floor(86400 * fractional_day);
	// let seconds = total_seconds % 60;
	// total_seconds -= seconds;

	// let hours = Math.floor(total_seconds / (60 * 60));
	// let minutes = Math.floor(total_seconds / 60) % 60;

	return new Date(date_info.getFullYear(), date_info.getMonth(), date_info.getDate());
}

// function sleep(ms: number) {
// 	return new Promise((resolve) => {
// 	  setTimeout(resolve, ms);
// 	});
//   }


function getDates(startDate: Date, stopDate: Date) {
    let dateArray = new Array();
    let currentDate = startDate;
    while (currentDate <= stopDate) {
		let newDate = new Date(currentDate)
        dateArray.push({year: newDate.getFullYear(), month: newDate.getMonth(), day: newDate.getDate()});
        currentDate.setDate(currentDate.getDate() + 1);
    }
    return dateArray;
}