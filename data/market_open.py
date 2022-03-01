import json
from urllib.request import urlopen

YOUR_API_TOKEN = "621c9da25c9875.11137446"

url = f"https://eodhistoricaldata.com/api/exchange-details/EXCHANGE_CODE?api_token={YOUR_API_TOKEN}"

response = urlopen(url)

data = json.loads(response.read())

print(data)




