from dotenv import load_dotenv
import os
import pyspark.sql.functions as F   
from pyspark.sql import SparkSession

load_dotenv()

AWS_ACCESS_KEY = os.getenv('AWS_ACCESS_KEY')
AWS_SECRET_KEY = os.getenv('AWS_SECRET_KEY')

POSTGRES_DB=os.getenv('POSTGRES_DB')
POSTGRES_USER=os.getenv("POSTGRES_USER")
POSTGRES_PASSWORD=os.getenv("POSTGRES_PASSWORD")
POSTGRES_HOST=os.getenv('AWS_PSQL_ADDRESS')

SPARK_ADDRESS=os.getenv('SPARK_ADDRESS')
MONGO_ADDRESS=os.getenv('MONGO_ADDRESS')

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
    


def read_dataframes(mongo_table):
    return spark.read.format('mongo').option('spark.mongodb.input.uri',f'mongodb://{MONGO_ADDRESS}/stonks.{mongo_table}').load()

df = read_dataframes("stockPrices")
df.show(5)
