
import finnhub
import csv
import time

finnhub_client = finnhub.Client(api_key="c8avhnqad3ifo5nsedtg")

data = finnhub_client.earnings_calendar(_from="2022-03-01", to="2022-03-31",symbol="", international=False)


with open('sp500_constituent.csv') as f:
    reader = csv.DictReader(f)
    items = list(reader)
    company_list = [item['symbol'] for item in items]


for company in company_list:
    earnings = finnhub_client.company_earnings(company, limit=5)
    if earnings:
        ticker = earnings[0]["symbol"]
        if company != ticker:
            print(f"csv symbol: {company}, finnhub symbol: {ticker}")
        else:
            print(company)
    else: 
        print(f"{company} not found in finnhub")
    time.sleep(1)

earnings = data["earningsCalendar"]

for earning in earnings:
    obj = {}
    obj["date"] = earning["date"]
    obj["ticker"] = earning["ticker"].replace(".", "-")