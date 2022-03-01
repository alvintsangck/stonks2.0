from dotenv import load_dotenv
import os
import pyspark.sql.functions as F   
from pyspark.sql import SparkSession
from pymongo import MongoClient
import time

client = MongoClient('mongodb',27017)

db = client.stonks

load_dotenv()

AWS_ACCESS_KEY = os.getenv('AWS_ACCESS_KEY')
AWS_SECRET_KEY = os.getenv('AWS_SECRET_KEY')

POSTGRES_DB=os.getenv('POSTGRES_DB')
POSTGRES_USER=os.getenv("POSTGRES_USER")
POSTGRES_PASSWORD=os.getenv("POSTGRES_PASSWORD")
POSTGRES_HOST=os.getenv('AWS_PSQL_ADDRESS')

SPARK_ADDRESS=os.getenv('SPARK_ADDRESS')
MONGO_ADDRESS=os.getenv('MONGO_ADDRESS')

start_time = time.perf_counter()

# Initialize Spark
packages = [
    "com.amazonaws:aws-java-sdk-s3:1.12.95",
    "org.mongodb.spark:mongo-spark-connector_2.12:3.0.1",
    "org.postgresql:postgresql:42.2.18"
]

spark = SparkSession.builder.appName("Transform Recent change stream")\
        .master(f'spark://{SPARK_ADDRESS}:7077')\
        .config("spark.jars.packages",",".join(packages))\
        .getOrCreate()
    
print(f"initialized spark, time elapsed: {time.perf_counter() - start_time}")

print("loading mongodb data")
df = spark.read.format('mongo').option('spark.mongodb.input.uri',f'mongodb://{MONGO_ADDRESS}/stonks.stockPrices').load()

df = df.withColumnRenamed('Close', 'price')
df = df.withColumn('year', F.year(df['Date']))
df = df.withColumn('month', F.month(df['Date']))
df = df.withColumn('day', F.dayofmonth(df['Date']))
df = df.drop('_id','High', 'Low', 'Open', 'Date', 'Volume')

print(f"finish loading from mongo, time elapsed: {time.perf_counter() - start_time}")

print("loading psql stocks table")
df2 = spark.read \
    .format("jdbc") \
    .option("url", f"jdbc:postgresql://{POSTGRES_HOST}:5432/{POSTGRES_DB}") \
    .option("dbtable", "stocks") \
    .option("user", POSTGRES_USER) \
    .option("password", POSTGRES_PASSWORD) \
    .option("driver", "org.postgresql.Driver") \
    .load()


df2 = df2.drop('name', 'industry_id', 'sector_id', 'created_at', 'updated_at')

df = df.join(df2, df.Ticker == df2.ticker, "inner")
df = df.drop('Ticker', 'ticker')
df = df.withColumnRenamed('id', 'stock_id')
df.show(5)

print(f"time elapsed: {time.perf_counter() - start_time}")

print("inserting data into staging_stocks_prices")
df.write.format('jdbc')\
    .format("jdbc") \
    .option("url", f"jdbc:postgresql://{POSTGRES_HOST}:5432/{POSTGRES_DB}") \
    .option("dbtable", "staging_stock_prices") \
    .option('user',POSTGRES_USER)\
    .option('password',POSTGRES_PASSWORD)\
    .option('driver','org.postgresql.Driver')\
    .option("batchsize", 1000)\
    .mode('append')\
    .save()

db.stockPrices.remove({})