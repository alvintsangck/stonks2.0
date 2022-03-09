from ast import List
from typing import Collection
from numpy import number
from playwright.sync_api import Playwright, sync_playwright
from pymongo import MongoClient
import time
from datetime import datetime
import csv

from sqlalchemy import String

client = MongoClient('localhost',27017)

db = client.stonks

bullish_collection = db.bullish

bearish_collection = db.bearish

neutral_collection = db.neutral

def run(playwright: Playwright, link: String) -> list:
    browser = playwright.chromium.launch(headless=True)
    context = browser.new_context()

    # Open new page
    page = context.new_page()

    # Go to https://ycharts.com/indicators/us_investor_sentiment_bullish
    page.goto(link)

    sign_in(page)

    no_of_pages_str = page.query_selector(".panel-pagination-count").inner_text()

    no_of_pages = int(no_of_pages_str.partition(" of ")[2])

    data_list = []

    for i in range(no_of_pages):
        
        time.sleep(1.5)
        
        tables = page.query_selector_all('yc-historical-data-table .table tbody tr')

        for table in tables:
            data = {}

            date_str = table.query_selector('td').inner_text()
            percent = table.query_selector('.text-right').inner_text()

            data["date"] = datetime.strptime(date_str, "%B %d, %Y")
            data["percent"] = float(percent.partition("%")[0])

            data_list.append(data)

        if i < no_of_pages - 1:
            page.locator("yc-historical-data-table >> text=Next").click()

    # ---------------------
    context.close()
    browser.close()

    return data_list

def sign_in(page):
    page.locator("text=Sign In").first.click()

    page.locator("[placeholder=\"name\\@company\\.com\"]").click()

    page.locator("[placeholder=\"name\\@company\\.com\"]").fill("ftstonkstrading@gmail.com")

    page.locator("[placeholder=\"Password\"]").click()

    page.locator("[placeholder=\"Password\"]").fill("Stonkstrading")

    page.locator("button:has-text(\"Sign In\")").click()

    print("Signed in, start scraping data...")

    time.sleep(2)

def insertMongo(ls: List, collection_name: Collection):
    print(f"{len(ls)} data scraped")
    duplicates = len(ls) - len(set([item["date"] for item in ls]))
    if duplicates:
        print(f"There are {duplicates} duplicate data")
    else:
        collection_name.insert_many(ls)
        print(f"inserted {len(ls)} data into {str(collection_name)}")


with sync_playwright() as playwright:
    bullish_list = run(playwright, "https://ycharts.com/indicators/us_investor_sentiment_bullish")
    insertMongo(bullish_list, bullish_collection)
