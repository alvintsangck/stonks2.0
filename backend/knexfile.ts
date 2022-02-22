import env from "./util/env";

const defaults = {
	client: "pg",
	connection: {
		database: env.DB_NAME,
		user: env.DB_USERNAME,
		password: env.DB_PASSWORD,
	},
	pool: {
		min: 2,
		max: 10,
	},
	migrations: {
		tableName: "knex_migrations",
	},
};

const knexConfigs = {
	development: {
		...defaults,
		// debug: true,
	},

	staging: {
		...defaults,
	},

	production: {
		...defaults,
	},
	test: {
		client: "pg",
		connection: {
			host: env.POSTGRES_HOST,
			database: env.POSTGRES_DB,
			user: env.POSTGRES_USER,
			password: env.POSTGRES_PASSWORD,
		},
		pool: {
			min: 2,
			max: 10,
		},
		migrations: {
			tableName: "knex_migrations",
		},
	},
	jest: {
		client: "pg",
		connection: {
			database: env.POSTGRES_DB,
			user: env.POSTGRES_USER,
			password: env.POSTGRES_PASSWORD,
		},
		pool: {
			min: 2,
			max: 10,
		},
		migrations: {
			tableName: "knex_migrations",
		},
	},
};

export default knexConfigs;
