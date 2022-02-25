import { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
	if (!(await knex.schema.hasTable("staging_stock_prices"))) {
		await knex.schema.createTable("staging_stock_prices", (table) => {
			table.increments();
			table.integer("stock_id").unsigned().notNullable().references("stocks.id");
			table.decimal("price", 12, 4);
			table.integer("year");
			table.integer("month");
			table.integer("day");
			table.timestamps(false, true);
		});
	}

	await knex.schema.raw(
		`CREATE OR REPLACE FUNCTION insert_stock_prices() RETURNS trigger AS $$
			DECLARE
				date_id integer;
			BEGIN
				INSERT INTO dim_dates (year,month,day) VALUES (NEW.year,NEW.month,NEW.day) on conflict(year,month,day) 
					DO UPDATE set updated_at = NOW() RETURNING id into date_id;

				INSERT INTO stock_prices (stock_id,date_id,price) VALUES (NEW.stock_id, NEW.date_id, NEW.price);
		
				return NEW;
			END
		$$ LANGUAGE plpgsql;
		
		CREATE TRIGGER stock_prices_trigger AFTER INSERT ON staging_stock_prices
		FOR EACH ROW EXECUTE PROCEDURE insert_stock_prices();
		`
	);
}

export async function down(knex: Knex): Promise<void> {
	await knex.schema.raw(`DROP TRIGGER IF EXISTS stock_prices_trigger ON staging_stock_prices;`);
	await knex.schema.dropTableIfExists("staging_stock_prices");
}
