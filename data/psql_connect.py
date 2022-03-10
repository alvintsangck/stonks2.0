import psycopg2
from config import config

# read connection parameters
params = config()

# connect to the PostgreSQL server
conn = psycopg2.connect(**params)


def execute_cursor():
    # create a cursor
    cur = conn.cursor()
        
	# execute a statement
    cur.execute("""INSERT INTO stock_prices (stock_id,date_id,price,created_at) 
                (select s.id as stock_id, dd.id as date_id, ssp.price, ssp.created_at 
                from staging_stock_prices ssp 
                join stocks s on s.ticker = ssp.ticker
                join dim_dates dd on dd."year" = ssp."year" and dd."month" = ssp."month" and dd."day" = ssp."day" 
                where ssp.created_at in (select created_at from staging_stock_prices order by created_at desc limit 1)) on conflict(stock_id, date_id) 
	 			DO UPDATE set updated_at = NOW();""")
       
    conn.commit()
	# close the communication with the PostgreSQL
    cur.close()

def close_connection():
    if conn is not None:
        conn.close()
        print('Database connection closed.')



if __name__ == '__main__':
    execute_cursor()
    close_connection()

