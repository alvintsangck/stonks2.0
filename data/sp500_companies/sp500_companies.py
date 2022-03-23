import csv

with open('sp500_constituent.csv') as f:
    reader = csv.DictReader(f)
    items = list(reader)
    company_list = [item['symbol'] for item in items]

print(company_list)

