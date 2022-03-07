import yfinance as yf
from urllib.request import urlopen
import certifi
import json
import csv
import pandas as pd
from datetime import datetime, timedelta

date = (datetime.now() - timedelta(1)).strftime('%Y-%m-%d')
end = datetime.now()
start = end - timedelta(1)
is_market_open = yf.download("SPY", start=start, end=end, group_by='ticker', auto_adjust=True)

if is_market_open.empty:
    print("market is closed")
    exit()

def get_jsonparsed_data(url):
    response = urlopen(url, cafile=certifi.where())
    data = response.read().decode("utf-8")
    return json.loads(data)

url = ("https://financialmodelingprep.com/api/v3/stock/list?apikey=3a001506d7161a8269397deeb7217f51")

tickers = pd.read_excel("./data.xlsx", sheet_name="stocks")
ticker_list = list(tickers['ticker'])
stocklist = get_jsonparsed_data(url)

results = []
stocks_not_working = []

for stock in stocklist:
    if (stock['symbol'] in ticker_list):
        obj = {}
        obj["ticker"] = stock['symbol']
        obj["price"] = stock['price']
        obj["date"] = date
        results.append(obj)

result_tickers_list = []
for result in results:
    ticker = result["ticker"]
    result_tickers_list.append(ticker)

for ticker in ticker_list:
    if ticker not in result_tickers_list:
        stocks_not_working.append(ticker)

with open(f"stocks_not_downloaded.txt ", "w") as f:
    f.write(f"Total no. of missing stocks = {len(stocks_not_working)}\n")
    for stock in stocks_not_working:
        f.write(f'{stock}\n')

keys = results[0].keys()

with open('stock_prices.csv', 'w', newline='') as output_file:
    dict_writer = csv.DictWriter(output_file, keys)
    dict_writer.writeheader()
    dict_writer.writerows(results)