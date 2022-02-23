
import finnhub
finnhub_client = finnhub.Client(api_key="c8avhnqad3ifo5nsedtg")

print(finnhub_client.earnings_calendar(_from="2021-06-10", to="2021-06-30", symbol="", international=False))

