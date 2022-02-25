from urllib.request import urlopen
import certifi
import json
import csv
import pandas as pd

def get_jsonparsed_data(url):
    response = urlopen(url, cafile=certifi.where())
    data = response.read().decode("utf-8")
    return json.loads(data)

# url = ("https://financialmodelingprep.com/api/v3/available-traded/list?apikey=3a001506d7161a8269397deeb7217f51")
# url = ("https://financialmodelingprep.com/api/v3/stock/list?apikey=3a001506d7161a8269397deeb7217f51")

tickers = pd.read_excel("./data.xlsx", sheet_name="stocks")
ticker_list = list(tickers['ticker'])

ticker_str = ','.join(ticker_list)

url = (f"https://financialmodelingprep.com/api/v3/quote/{ticker_str}?apikey=3a001506d7161a8269397deeb7217f51")
stocklist = get_jsonparsed_data(url)

keys = stocklist[0].keys()

with open('stocklist2.csv', 'w', newline='') as f:
    dict_writer = csv.DictWriter(f, keys)
    dict_writer.writeheader()
    dict_writer.writerows(stocklist)

