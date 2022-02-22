import yfinance as yf
import numpy as np
import pandas as pd
from datetime import datetime, timedelta
import time
import math
import os
import json


# path=r'./import/'
# time config
# start_time = datetime.today().strftime('%Y-%m-%d-%H-%M-%S')
end = datetime.today()
# start_day = end - timedelta(1)
# start_year = datetime(end.year - 1, end.month, end.day)
#check start time
start = datetime(2022,2,18)

#tickers config
tickers = pd.read_excel("./data.xlsx", sheet_name="stocks")
ticker_list = list(tickers['ticker'])
split = ['GOOG', 'AAPL']

ticker_string = ' '.join(split)

print("downloading stocks...")
start_download = time.perf_counter()
data = yf.download(ticker_string, start=start, end=start, group_by='ticker', auto_adjust=True)

stock_data = []
stocks_not_working = []

i = 1
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
        # df = df[['Ticker', 'Close']]
        # df['Date'] = df.index
        print(df)
        result = df.to_json(orient="records")
        obj = json.loads(result)
        # obj[0]['Date'] = datetime.fromtimestamp(int(obj[0]['Date'])).strftime('%Y-%m-%d')
        stock_data += obj
        # print(f'{df.head()}\nno. of stocks: {i}')
    i += 1

print(stock_data)

# splits = np.array_split(ticker_list, 5)

# stock_data = pd.DataFrame()
# stocks_not_working = []

# for split in splits:

#     print(split)

#     ticker_string = ' '.join(split)

#     print("downloading stocks...")
#     start_download = time.perf_counter()
#     data = yf.download(ticker_string, start=start, end=start, group_by='ticker', auto_adjust=True)

#     i = 1
#     for ticker in split:
#         if (len(split) > 1):
#             df = data[ticker]
#         else:
#             df = data
#         df = df.dropna()
#         if(df.shape[0] == 0):
#             stocks_not_working.append(ticker)
#         else:
#             df.insert(0, 'Ticker', ticker)
#             if (end - start).days == 1:
#                 df = df.loc[str(start_day.date())]
#             df = df[['Ticker', 'Close']]
#             stock_data = stock_data.append(df)
#             print(f'{df.head()}\nno. of stocks: {i}')
#         i += 1



    # print(data)
    # result = df.to_json(orient="records")
    # parsed = json.loads(result)
    # print(parsed)
    # end_download = time.perf_counter()