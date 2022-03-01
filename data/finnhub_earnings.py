
import finnhub
finnhub_client = finnhub.Client(api_key="c8avhnqad3ifo5nsedtg")

print(finnhub_client.earnings_calendar(_from="2022-03-01", to="2022-03-1",symbol="", international=False))


