from numpy import number
from playwright.sync_api import Playwright, sync_playwright
from pymongo import MongoClient
import time
from datetime import datetime
import csv

from sqlalchemy import String

client = MongoClient('localhost',27017)

db = client.stonks

data_list = []

def run(playwright: Playwright, link: String) -> None:
    browser = playwright.chromium.launch(headless=True)
    context = browser.new_context()

    # Open new page
    page = context.new_page()

    # Go to https://ycharts.com/indicators/us_investor_sentiment_bullish
    page.goto(link)

    sign_in(page)

    no_of_pages_str = page.query_selector(".panel-pagination-count").inner_text()

    no_of_pages = int(no_of_pages_str.partition(" of ")[2])

    for i in range(no_of_pages):
        
        time.sleep(0.5)
        
        tables = page.query_selector_all('yc-historical-data-table .table tbody tr')

        for table in tables:
            data = {}

            date_str = table.query_selector('td').inner_text()
            percent = table.query_selector('.text-right').inner_text()

            data["date"] = datetime.strptime(date_str, "%B %d, %Y").date()
            data["percent"] = float(percent.partition("%")[0])

            data_list.append(data)

        if i < no_of_pages - 1:
            page.locator("yc-historical-data-table >> text=Next").click()
            

    print(len(data_list))
    print("first", data_list[0])
    print("last", data_list[-1])


    # ---------------------
    context.close()
    browser.close()


def sign_in(page):
    page.locator("text=Sign In").first.click()

    page.locator("[placeholder=\"name\\@company\\.com\"]").click()

    page.locator("[placeholder=\"name\\@company\\.com\"]").fill("ftstonkstrading@gmail.com")

    page.locator("[placeholder=\"Password\"]").click()

    page.locator("[placeholder=\"Password\"]").fill("Stonkstrading")

    page.locator("button:has-text(\"Sign In\")").click()

    time.sleep(2)


with sync_playwright() as playwright:
    run(playwright, "https://ycharts.com/indicators/us_investor_sentiment_bullish")

keys = data_list[0].keys()

with open('bullish.csv', 'w', newline='') as output_file:
    dict_writer = csv.DictWriter(output_file, keys)
    dict_writer.writeheader()
    dict_writer.writerows(data_list)