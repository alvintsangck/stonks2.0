import yfinance as yf
from urllib.request import urlopen
import certifi
import json
import csv
import pandas as pd
from datetime import datetime, timedelta
from pymongo import MongoClient
import os
import time

client = MongoClient('mongodb',27017)

db = client.stonks

end = datetime(2022, 3, 5)
start = end - timedelta(1)
date = start.strftime('%Y-%m-%d')
is_market_open = yf.download("SPY", start=start, end=end, group_by='ticker', auto_adjust=True)
print(is_market_open)

if is_market_open.empty:
    print("market is closed ytd")
    exit()

start_time = time.perf_counter()

def get_jsonparsed_data(url):
    response = urlopen(url, cafile=certifi.where())
    data = response.read().decode("utf-8")
    return json.loads(data)

url = ("https://financialmodelingprep.com/api/v3/stock/list?apikey=3a001506d7161a8269397deeb7217f51")

#change directory path
os.chdir("/opt/bitnami/spark/src/")

tickers = pd.read_excel("./new_data.xlsx", sheet_name="stocks")
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

# result_tickers_list = []
# for result in results:
#     ticker = result["ticker"]
#     result_tickers_list.append(ticker)

# for ticker in ticker_list:
#     if ticker not in result_tickers_list:
#         stocks_not_working.append(ticker)

# print(stocks_not_working)

db.stockPricesToday.insert_many(results)

end_time = time.perf_counter()

print(f'total time used: {(end_time - start_time)} seconds')
