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
    cur.execute("""INSERT INTO economic_indicators (indicator_id, country_id, date_id, stat, created_at) 
                (select di.id as indicator_id, dc.id as country_id, dd.id as date_id, sei.stat, sei.created_at 
                from staging_economic_indicators sei 
                join dim_dates dd on dd.year = sei.year and dd.month = sei.month and dd.day = sei.day
                join dim_countries dc on dc.country = sei.country
                join dim_indicators di on di.indicator = sei.indicator where  di.id != 4 and
                sei.updated_at in (select updated_at from staging_economic_indicators order by updated_at desc limit 1));""")
                
    cur.execute("""INSERT INTO economic_indicators (indicator_id, country_id, date_id, stat, created_at) 
                (select di.id as indicator_id, dc.id as country_id, dd.id as date_id, (sei.stat/100) as stat, sei.created_at 
                from staging_economic_indicators sei 
                join dim_dates dd on dd.year = sei.year and dd.month = sei.month and dd.day = sei.day
                join dim_countries dc on dc.country = sei.country
                join dim_indicators di on di.indicator = sei.indicator where  di.id = 4 and
                sei.updated_at in (select updated_at from staging_economic_indicators order by updated_at desc limit 1));""")

    conn.commit()
	# close the communication with the PostgreSQL
    cur.close()

    print('Inserted into economic_indicators')

def close_connection():
    if conn is not None:
        conn.close()
        print('Database connection closed.')



if __name__ == '__main__':
    execute_cursor()
    close_connection()
    exit()
