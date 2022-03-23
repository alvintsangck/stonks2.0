from dotenv import load_dotenv
import os
import pyspark.sql.functions as F   
from pyspark.sql import SparkSession
from pymongo import MongoClient
import time

def main():
    client = MongoClient('mongodb',27017)

    db = client.stonks

    load_dotenv()

    AWS_ACCESS_KEY = os.getenv('AWS_ACCESS_KEY')
    AWS_SECRET_KEY = os.getenv('AWS_SECRET_KEY')

    AWS_BUCKET_NAME = os.getenv("AWS_BUCKET_NAME")

    POSTGRES_DB=os.getenv('POSTGRES_DB')
    POSTGRES_USER=os.getenv("POSTGRES_USER")
    POSTGRES_PASSWORD=os.getenv("POSTGRES_PASSWORD")
    POSTGRES_HOST_1=os.getenv('AWS_PSQL_ADDRESS_1')
    POSTGRES_HOST_2=os.getenv('AWS_PSQL_ADDRESS_2')
    # POSTGRES_HOST=os.getenv('POSTGRES_HOST')

    SPARK_ADDRESS=os.getenv('SPARK_ADDRESS')
    MONGO_ADDRESS=os.getenv('MONGO_ADDRESS')

    start_time = time.perf_counter()

    # Initialize Spark
    packages = [
        "com.amazonaws:aws-java-sdk-s3:1.12.158",
        "org.apache.hadoop:hadoop-aws:3.3.1",
        "org.apache.spark:spark-avro_2.12:3.2.1",
        "org.mongodb.spark:mongo-spark-connector_2.12:3.0.1",
        "org.postgresql:postgresql:42.2.18"
    ]

    spark = SparkSession.builder.appName("Transform Recent change stream")\
            .master(f'spark://{SPARK_ADDRESS}:7077')\
            .config("spark.jars.packages",",".join(packages))\
            .config("spark.hadoop.fs.s3a.access.key",AWS_ACCESS_KEY)\
            .config("spark.hadoop.fs.s3a.secret.key",AWS_SECRET_KEY)\
            .config("spark.hadoop.fs.s3a.impl","org.apache.hadoop.fs.s3a.S3AFileSystem")\
            .config("spark.hadoop.fs.s3a.multipart.size",104857600)\
            .config("com.amazonaws.services.s3a.enableV4", "true")\
            .config("spark.hadoop.fs.s3a.path.style.access", "false")\
            .getOrCreate()
        
    print(f"initialized spark, time elapsed: {time.perf_counter() - start_time}")


    print("loading mongodb data")
    df = spark.read.format('mongo').option('spark.mongodb.input.uri',f'mongodb://{MONGO_ADDRESS}/stonks.earningsToday').load()

    print(f"finished loading from mongo, time elapsed: {time.perf_counter() - start_time}")

    # df = df.filter(df.date == date_for_mongo)
    # df.show()
    df = df.withColumn('year', F.year(df['date']))
    df = df.withColumn('month', F.month(df['date']))
    df = df.withColumn('day', F.dayofmonth(df['date']))
    df = df.withColumn('release_time', F.when(F.col('release_time')=="", "tbc").otherwise(F.col('release_time')))
    df = df.withColumnRenamed('date', 'created_at')
    df = df.drop('_id')
    df.show()

    print("inserting data into psql 1")
    df.write.format('jdbc')\
    .format("jdbc") \
    .option("url", f"jdbc:postgresql://{POSTGRES_HOST_1}:5432/{POSTGRES_DB}") \
    .option("dbtable", "staging_stock_earnings") \
    .option('user',POSTGRES_USER)\
    .option('password',POSTGRES_PASSWORD)\
    .option('driver','org.postgresql.Driver')\
    .option("batchsize", 1000)\
    .mode('append')\
    .save()

    print("inserting data into psql 2")
    df.write.format('jdbc')\
    .format("jdbc") \
    .option("url", f"jdbc:postgresql://{POSTGRES_HOST_2}:5432/{POSTGRES_DB}") \
    .option("dbtable", "staging_stock_earnings") \
    .option('user',POSTGRES_USER)\
    .option('password',POSTGRES_PASSWORD)\
    .option('driver','org.postgresql.Driver')\
    .option("batchsize", 1000)\
    .mode('append')\
    .save()

    print(f"finsihed inserting time elapsed: {time.perf_counter() - start_time}")

    print("writing avro to S3")
    df.write.format('avro').save(os.path.join(f's3a://{AWS_BUCKET_NAME}/earnings_data.avro'),mode="append")
    print(f"finsihed writing to S3. Time elapsed: {time.perf_counter() - start_time}")

    print("removing data in mongodb")
    db.earningsToday.drop()

    end_time = time.perf_counter()

    print(f'total time used: {(end_time - start_time) // 60} minutes, {(end_time - start_time) % 60} seconds')

    print("stopping spark")
    spark.stop()
    print('stopped spark')

    exit()

if __name__ == '__main__':
    main()