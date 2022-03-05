
import finnhub
finnhub_client = finnhub.Client(api_key="c8avhnqad3ifo5nsedtg")

print(finnhub_client.earnings_calendar(_from="2022-03-01", to="2022-03-1",symbol="", international=False))

#Earnings Calendar
"https://finnhub.io/api/v1/calendar/earnings?from=2022-02-01&to=2022-02-10&token=c8avhnqad3ifo5nsedtg"

#IPO Calendar
"https://finnhub.io/api/v1/calendar/ipo?from=2020-01-01&to=2020-04-30&token=c8avhnqad3ifo5nsedtg"