from playwright.sync_api import Playwright, sync_playwright
from pymongo import MongoClient
import time
from datetime import datetime
import csv

client = MongoClient('localhost',27017)

db = client.stonks

# db.treasuryRates.drop()

data_list = []

indicator_list = ["1 Month", "3 Month", "6 Month", "1 Year", "3 Year", "5 Year", "7 Year", "10 Year", "20 Year", "30 Year"]

url_list = ["1_month", "3_month", "6_month", "1_year", "3_year", "5_year", "7_year", "10_year", "20_year", "30_year"]

def run(playwright: Playwright, link: str, indicator: str):
    browser = playwright.chromium.launch(headless=True)
    context = browser.new_context()

    # Open new page
    page = context.new_page()

    # Go to https://ycharts.com/indicators/us_investor_sentiment_bullish
    page.goto(f"https://ycharts.com/indicators/{link}_treasury_rate")

    print(f"directing to https://ycharts.com/indicators/{link}_treasury_rate...")

    sign_in(page)

    no_of_pages_str = page.query_selector(".panel-pagination-count").inner_text()

    print(no_of_pages_str)

    no_of_pages = int(no_of_pages_str.partition(" of ")[2])

    individual_data_list = []

    for i in range(no_of_pages):
        
        time.sleep(1.5)
        
        tables = page.query_selector_all('yc-historical-data-table .table tbody tr')

        for table in tables:
            data = {}

            date_str = table.query_selector('td').inner_text()
            stat = table.query_selector('.text-right').inner_text()

            if stat:
                data["name"] = indicator
                data["rate"] = float(stat.partition("%")[0])
                data["date"] = datetime.strptime(date_str, "%B %d, %Y")
                individual_data_list.append(data)

        if i < no_of_pages - 1:
            page.locator("yc-historical-data-table >> text=Next").click()

    # ---------------------
    context.close()
    browser.close()

    check_duplicates_and_insert(data_list, individual_data_list)


def sign_in(page):
    page.locator("text=Sign In").first.click()

    page.locator("[placeholder=\"name\\@company\\.com\"]").click()

    page.locator("[placeholder=\"name\\@company\\.com\"]").fill("ftstonkstrading@gmail.com")

    page.locator("[placeholder=\"Password\"]").click()

    page.locator("[placeholder=\"Password\"]").fill("Stonkstrading")

    page.locator("button:has-text(\"Sign In\")").click()

    print("Signed in, start scraping data...")

    time.sleep(3)

def check_duplicates_and_insert(data_list: list, individual_data_list: list):
    print(f"{len(individual_data_list)} data scraped, checking duplicates")
    duplicates = len(individual_data_list) - len(set([item["date"] for item in individual_data_list]))
    if duplicates:
        print(f"There are {duplicates} duplicate data")
    else:
        data_list += individual_data_list


# with sync_playwright() as playwright:
#     run(playwright, "china_gdp_currencys", "indicator", "China")

with sync_playwright() as playwright:
    i = 1
    for indicator, url in zip(indicator_list, url_list):
            run(playwright, url, indicator)
            print(f"{i} of 10 completed")

    print("data_list length:", len(data_list))
    db.treasuryRates.insert_many(data_list)


# keys = data_list[0].keys()

# with open('treasury_rates_scraping.csv', 'w', newline='') as output_file:
#     dict_writer = csv.DictWriter(output_file, keys)
#     dict_writer.writeheader()
#     dict_writer.writerows(data_list)

print(f"total time used = {time.perf_counter() // 60} minutes, {time.perf_counter() % 60} seconds")