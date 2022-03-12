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
    cur.execute("""INSERT INTO treasury_rates (maturity_period_id, date_id, rate, created_at) 
                (select dmp.id as maturity_period_id, dd.id as date_id, str.rate , str.created_at 
                from staging_treasury_rates str
                join dim_dates dd on dd."year" = str."year" and dd."month" = str."month" and dd."day" = str."day"
                join dim_maturity_periods dmp on dmp."name" = str."name"
                where str.updated_at in (select updated_at from staging_treasury_rates order by updated_at desc limit 1));""")
       
    conn.commit()
	# close the communication with the PostgreSQL
    cur.close()

    print('Inserted into treasury_rates')

def close_connection():
    if conn is not None:
        conn.close()
        print('Database connection closed.')



if __name__ == '__main__':
    execute_cursor()
    close_connection()
    exit()
