from datetime import datetime, timedelta

end = datetime.now()
start = end - timedelta(1)
date_for_mongo = str(start.strftime('%Y-%m-%d'))

print(start)
print(end)
print(date_for_mongo)