import { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
	if (!(await knex.schema.hasTable("industry_rs"))) {
		await knex.schema.createTable("industry_rs", (table) => {
			table.increments();
			table.integer("industry_id").unsigned().notNullable().references("industries.id");
			table.integer("rs_rating").unsigned();
			table.integer("ranking").unsigned();
			table.timestamps(false, true);
		});
	}

	if (!(await knex.schema.hasTable("stock_prices"))) {
		await knex.schema.createTable("stock_prices", (table) => {
			table.increments();
			table.integer("stock_id").unsigned().notNullable().references("stocks.id");
			table.decimal("price", 10, 4);
			table.integer("rs_rating").unsigned();
			table.timestamps(false, true);
		});
	}

	if (!(await knex.schema.hasTable("stock_rs"))) {
		await knex.schema.createTable("stock_rs", (table) => {
			table.increments();
			table.integer("stock_id").unsigned().notNullable().references("stocks.id");
			table.decimal("off_year_high", 10, 2);
			table.integer("rs_rating").unsigned();
			table.timestamps(false, true);
		});
	}

	if (!(await knex.schema.hasTable("stock_market_caps"))) {
		await knex.schema.createTable("stock_market_caps", (table) => {
			table.increments();
			table.integer("stock_id").unsigned().notNullable().references("stocks.id");
			table.decimal("market_cap", 10, 2);
			table.timestamps(false, true);
		});
	}

	if (!(await knex.schema.hasTable("stock_earnings"))) {
		await knex.schema.createTable("stock_earnings", (table) => {
			table.increments();
			table.integer("stock_id").unsigned().notNullable().references("stocks.id");
			table.integer("year");
			table.integer("quarter");
			table.decimal("eps_estimated", 14, 2);
			table.decimal("eps_reported", 14, 2);
			table.decimal("revenue_estimated", 14, 2);
			table.decimal("revenue_reported", 14, 2);
			table.timestamps(false, true);
		});
	}
}

export async function down(knex: Knex): Promise<void> {
	await knex.schema.dropTableIfExists("stock_earnings");
	await knex.schema.dropTableIfExists("stock_market_caps");
	await knex.schema.dropTableIfExists("stock_rs");
	await knex.schema.dropTableIfExists("stock_prices");
	await knex.schema.dropTableIfExists("industry_rs");
}
