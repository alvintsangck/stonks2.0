import { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
	if (!(await knex.schema.hasTable("dim_dates"))) {
		await knex.schema.createTable("dim_dates", (table) => {
			table.increments();
			table.integer("year");
			table.integer("month");
			table.integer("day");
			table.timestamps(false, true);
		});
	}

	await knex.schema.raw(`CREATE UNIQUE INDEX dates_unique_idx on dim_dates(year,month,day); `);

	if (!(await knex.schema.hasTable("dim_year_quarters"))) {
		await knex.schema.createTable("dim_year_quarters", (table) => {
			table.increments();
			table.integer("year");
			table.integer("quarter");
			table.timestamps(false, true);
		});
	}

	await knex.schema.raw(`CREATE UNIQUE INDEX year_quarters_unique_idx on dim_year_quarters(year,quarter); `);

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
			table.integer("date_id").unsigned().notNullable().references("dim_dates.id");
			table.decimal("price", 12, 4);
			table.timestamps(false, true);
		});
	}

	await knex.schema.raw(`CREATE UNIQUE INDEX stock_prices_idx on stock_prices(stock_id, date_id); `);

	if (!(await knex.schema.hasTable("stock_rs"))) {
		await knex.schema.createTable("stock_rs", (table) => {
			table.increments();
			table.integer("stock_id").unsigned().notNullable().references("stocks.id");
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
			table.integer("date_id").unsigned().notNullable().references("dim_dates.id");
			table.integer("year_quarter_id").unsigned().notNullable().references("dim_year_quarters.id");
			table.string("hour");
			table.decimal("eps_estimated", 10, 4);
			table.decimal("eps_reported", 10, 4);
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
	await knex.schema.dropTableIfExists("dim_dates");
	await knex.schema.dropTableIfExists("dim_year_quarters");
}
