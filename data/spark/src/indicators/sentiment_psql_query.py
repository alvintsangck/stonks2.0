import psycopg2
import os
import sys
os.chdir("/opt/bitnami/spark/src/")
sys.path.append('psql_config/')
from config import config

# read connection parameters
params = config()

# connect to the PostgreSQL server
conn = psycopg2.connect(**params)


def execute_cursor():
    # create a cursor
    cur = conn.cursor()

    # cur.execute("select * from stocks limit 1")

	# execute a statement
    cur.execute("""INSERT INTO sentiment_indicators (sentiment_id, date_id, stat, created_at) 
                (select ds.id as sentiment_id, dd.id as date_id, ssi.stat, ssi.created_at 
                from staging_sentiment_indicators ssi 
                join dim_dates dd on dd."year" = ssi."year" and dd."month" = ssi."month" and dd."day" = ssi."day"
                join dim_sentiments ds on ds.sentiment = ssi.sentiment
                where ssi.updated_at in (select updated_at from staging_sentiment_indicators order by updated_at desc limit 1));""")
       
    conn.commit()
	# close the communication with the PostgreSQL
    cur.close()

    print('Inserted into sentiment_indicators')

def close_connection():
    if conn is not None:
        conn.close()
        print('Database connection closed.')



if __name__ == '__main__':
    execute_cursor()
    close_connection()
    exit()
