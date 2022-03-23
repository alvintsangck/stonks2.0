import click
import historical_data.earnings as hist_earnings
import historical_data.economic_indicators as hist_economics
import historical_data.sentiment_indicators as hist_sentiments
import historical_data.treasury_rates as hist_rates
import historical_data.yfinance_stock_price as hist_stock_prices
from psql_config.config import config

@click.group()
def cli():
    pass

@click.command(name='hist_earnings')
def get_all_earnings():
    hist_earnings.finnhub_to_mongo.main()
    hist_earnings.finnhub_mongo_to_psql.main()

@click.command(name='hist_economics')
def get_all_economics():
    hist_economics.economic_indicator_scraping.main()
    hist_economics.econ_mongo_to_psql.main()

@click.command(name='hist_sentiments')
def get_all_sentiments():
    hist_sentiments.sentiment_indicator_scraping.main()
    hist_sentiments.sentiment_mongo_to_psql.main()   

@click.command(name='hist_rates')
def get_all_rates():
    hist_rates.treasury_rates_scraping.main()
    hist_rates.rates_mongo_to_psql.main()   

@click.command(name='hist_stock_prices')
def get_one_year_stock_price():
    hist_stock_prices.yfinance_to_mongo.main()
    hist_stock_prices.mongo_to_postgres.main()
    hist_stock_prices.psql_connect.main(config)

cli.add_command(get_all_earnings)
cli.add_command(get_all_economics)
cli.add_command(get_all_sentiments)
cli.add_command(get_all_rates)
cli.add_command(get_one_year_stock_price)

if __name__ == '__main__':
    cli()