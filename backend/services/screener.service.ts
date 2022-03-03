import { Knex } from "knex";
import { Industry, Sector } from "../util/models";

export class ScreenerService {
	constructor(private knex: Knex) {}

	async getAllIndustries(): Promise<Industry[]> {
		return await this.knex("industries").select("id", "name");
	}

	async getAllSectors(): Promise<Sector[]> {
		return await this.knex("sectors").select("id", "name");
	}

	async screenStocks(
		price: any,
		offYearHigh: any,
		marketCap: any,
		rS: any,
		industryRs: any,
		industryRank: any,
		industryIds: number[],
		sectorIds: number[]
	) {
		return await this.knex("screeners")
			.select("*")
			.whereIn("industry_id", industryIds)
			.whereIn("sector_id", sectorIds)
			.whereBetween("price", price)
			.whereBetween("off_year_high", offYearHigh)
			.whereBetween("market_cap", marketCap)
			.whereBetween("rs_rating", rS)
			.whereBetween("industry_rs", industryRs)
			.whereBetween("industry_rank", industryRank);
	}
}
