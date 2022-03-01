import yfinance as yf
import numpy as np
import pandas as pd
from pymongo import MongoClient
from datetime import datetime, timedelta
import time
import math
import os
import json
import pytz

client = MongoClient('localhost',27017)

db = client.stonks

end = datetime.now()
start_day = end - timedelta(1)
start = datetime(end.year -1, end.month, end.day, end.hour)

print("start date:", start, "end date:", end)

#tickers config
tickers = pd.read_excel("./data.xlsx", sheet_name="stocks")
ticker_list = list(tickers['ticker'])



# stock_data = []
stocks_not_working = []

splits = np.array_split(ticker_list, 5)

start_time = time.perf_counter()

for split in splits:

    print(split[0], "to", split[-1])

    ticker_string = ' '.join(split)

    print("downloading stocks...")
    data = yf.download(ticker_string, start=start, end=end, group_by='ticker', auto_adjust=True)

    print("inserting into mongodb...")
    for ticker in split:
        if (len(split) > 1):
            df = data[ticker]
        else:
            df = data
        df = df.dropna()
        if(df.shape[0] == 0):
            stocks_not_working.append(ticker)
        else:
            df.insert(0, 'Ticker', ticker)
            if (end - start).days == 1:
                df = df.loc[str(start_day.date())]
            df.reset_index(level=0, inplace=True)
            df['Date'] = df['Date'].dt.strftime('%Y-%m-%d')
            result = df.to_json(orient="records")
            obj = json.loads(result)
            db.stockPrices.insert_many(obj)

    print(f"time elapsed: {time.perf_counter() - start_time}")

with open(f"stocks_not_downloaded.txt ", "w") as f:
    f.write(f"Total no. of missing stocks = {len(stocks_not_working)}\n")
    for stock in stocks_not_working:
        f.write(f'{stock}\n')

end_time = time.perf_counter()

print(f'total time used: {(end_time - start_time) // 60} minutes, {(end_time - start_time) % 60} seconds')
