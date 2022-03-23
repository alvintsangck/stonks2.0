
import os
import finnhub
import csv
from datetime import datetime, timedelta
from dateutil.relativedelta import relativedelta
from pymongo import MongoClient
from pytz import timezone

client = MongoClient('mongodb',27017)

db = client.stonks

db.earningsToday.drop()

finnhub_client = finnhub.Client(api_key="c8avhnqad3ifo5nsedtg")

hkt = timezone('Asia/Hong_Kong')
print("time now:", datetime.now(tz=hkt))

today = (datetime.now()).strftime('%Y-%m-%d')
tmr = (datetime.now() + timedelta(1)).strftime('%Y-%m-%d')
ytd = (datetime.now() - timedelta(1)).strftime('%Y-%m-%d')
last_month = (datetime.now() - relativedelta(months=+1)).strftime('%Y-%m-%d')
next_month= (datetime.now() + relativedelta(months=+1)).strftime('%Y-%m-%d')

print(f"date range: {today} to {next_month}")

data1 = finnhub_client.earnings_calendar(_from=last_month, to=ytd,symbol="", international=False)
data2 = finnhub_client.earnings_calendar(_from=ytd, to=today,symbol="", international=False)
data3 = finnhub_client.earnings_calendar(_from=tmr, to=next_month,symbol="", international=False)

os.chdir("/opt/bitnami/spark/src/earnings")
with open('sp500_constituent.csv') as f:
    reader = csv.DictReader(f)
    items = list(reader)
    company_list = [item['symbol'] for item in items]

earnings = data2["earningsCalendar"] + data3["earningsCalendar"] + data1["earningsCalendar"] 

# {"date":"2022-02-15","epsActual":0.18,"epsEstimate":0.1317,"hour":"amc","quarter":4,"revenueActual":224300000,"revenueEstimate":210803959,"symbol":"ZI","year":2021}

result_list = []
for earning in earnings:
    ticker = earning["symbol"]
    if ticker in company_list:
        obj = {}
        obj["ticker"] = ticker.replace(".", "-")
        obj["earning_year"] = earning["year"]
        obj["earning_quarter"] = earning["quarter"]
        obj["release_time"] = earning["hour"]
        obj["eps_estimated"] = earning["epsEstimate"] if earning["epsEstimate"] else None
        obj["eps_reported"] = earning["epsActual"] if earning["epsActual"] else None
        obj["revenue_estimated"] = float(earning["revenueEstimate"] / 1000000) if earning["revenueEstimate"] else None
        obj["revenue_reported"] = float(earning["revenueActual"] / 1000000) if earning["revenueActual"] else None
        obj["date"] = datetime.strptime(earning["date"], '%Y-%m-%d')
        
        result_list.append(obj)
        
# sorted_list = sorted(result_list, key = lambda x: x["date"])

# for stock in sorted_list:
#     print(stock)

if result_list:
    db.earningsToday.insert_many(result_list)

else:
    print("no earnings release")

print(f"inserted {len(result_list)} data into mongodb earnings collection.")







# for company in company_list:
#     earnings = finnhub_client.company_earnings(company, limit=5)
#     if earnings:
#         ticker = earnings[0]["symbol"]
#         if company != ticker:
#             print(f"csv symbol: {company}, finnhub symbol: {ticker}")
#         else:
#             print(company)
#     else: 
#         print(f"{company} not found in finnhub")
#     time.sleep(1)