import yfinance as yf
import numpy as np
import pandas as pd
from datetime import datetime, timedelta
import time
import math
import os

path=r'./import/'
# time config
start_time = datetime.today().strftime('%Y-%m-%d-%H-%M-%S')
end = datetime.today()
start_day = end - timedelta(1)
start_year = datetime(end.year - 1, end.month, end.day)
#check start time
start = start_year

#tickers config
tickers = pd.read_excel("../../backend/seeds/new_data.xlsx", sheet_name="stocks")
ticker_list = list(tickers['ticker'])
# ticker_list = ["GOOG"]
ticker_string = ' '.join(ticker_list)

def calculate_time(start_time, end_time):
    minute = int((end_time - start_time) // 60)
    second = (end_time - start_time) % 60
    return f'{minute} minutes {second} seconds'

splits = np.array_split(ticker_list, 2)

stock_data = pd.DataFrame()
stocks_not_working = []

start_download = time.perf_counter()
for split in splits:

    print(split[0], "to", split[-1])

    ticker_string = ' '.join(split)

    print("downloading stocks...")
    data = yf.download(ticker_string, start=start, end=end, group_by='ticker', auto_adjust=True)

    print(f"time elapsed: {time.perf_counter() - start_download}")

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
            df = df[['Ticker', 'Close']]
            stock_data = stock_data.append(df)
            print(f'{df.head()}\nno. of stocks: {i}')
        i += 1

end_download = time.perf_counter()

save_string = 'day' if (end - start).days == 1 else 'year'

print(f'start loading xlsx...')

start_file = time.perf_counter()
chunk_size = 50000
num_chunks = math.ceil(len(stock_data) / chunk_size)

for i in range(num_chunks):
    chunk = stock_data[i*chunk_size:(i+1)*chunk_size]
    chunk.columns = ['ticker', 'price']
    chunk.index.names = ['date']
    chunk.to_excel(os.path.join(path, rf"chunk{i}.xlsx"))
end_file = time.perf_counter()

print(f'finished loading, time used = {calculate_time(start_file, end_file)}')

with open(f"stocks_not_downloaded_{start_time}.txt ", "w") as f:
    f.write(f"Total no. of missing stocks = {len(stocks_not_working)}\n")
    for stock in stocks_not_working:
        f.write(f'{stock}\n')

end_total = time.perf_counter()
print(f'download time : start: {start_download} seconds, end: {end_download} seconds\ntime used: {calculate_time(start_download, end_download)}')
print(f'total time used: {end_total // 60} minutes {end_total % 60} seconds')
