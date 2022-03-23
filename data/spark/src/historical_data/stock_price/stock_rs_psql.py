import os
import sys
import psycopg2
os.chdir("/opt/bitnami/spark/src/")
sys.path.append('psql_config/')
from config import config


def main(section: str):

    print("connecting to", section)
    
    # read connection parameters
    params = config(section)

    # connect to the PostgreSQL server
    conn = psycopg2.connect(**params)

    conn.autocommit = True

    calculate_rs(conn)

    industry_rs(conn)

    close_connection(conn)


def calculate_rs(conn):
    # create a cursor
    cur = conn.cursor()

    cur.execute("""REFRESH MATERIALIZED VIEW stock_historic_prices;""")

    cur.execute("select * from stock_historic_prices where ticker='IWV';")

    russel = cur.fetchall()[0]

    russel_perf = performance(russel)

    print("russel performance: ", russel_perf)

    cur.execute("select * from stock_historic_prices;")

    stock_list = cur.fetchall()

    tuples = []

    for stock in stock_list:
        stock_perf = performance(stock)
        date_id = stock[0]
        stock_id = stock[1]
        off_year_high = -float(percentChg(stock[4], stock[3]))
        relative_strength = float(percentChg(stock_perf, russel_perf))
        tuple = (date_id, stock_id, off_year_high, relative_strength)
        tuples.append(tuple)

    cur.execute("delete from temp_stock_rs;")

    try:
        query_str = to_query_str(tuples)
        cur.execute("INSERT INTO temp_stock_rs (date_id, stock_id, off_year_high, relative_strength) VALUES " + query_str) 

        print('Inserted into temp_stock_rs')

        cur.execute("""INSERT INTO stock_rs (date_id, stock_id, rs_rating)
                    (select date_id, stock_id,
			        round(percent_rank() OVER (ORDER BY relative_strength) * 100) as rs_rating
			        from temp_stock_rs order by stock_id) on conflict(stock_id, date_id) 
	 			    DO UPDATE set rs_rating = EXCLUDED.rs_rating, updated_at = NOW()""")
                     
        print('Inserted into stock_rs')

        conn.commit()

    except (Exception, psycopg2.DatabaseError) as error:
        print(f"Error: {error}")
        conn.rollback()
        cur.close()
        return 

    cur.close()

    

def industry_rs(conn):
    cur = conn.cursor()

    cur.execute("""REFRESH MATERIALIZED VIEW industry_rs_view;""")

    cur.execute("""INSERT INTO industry_rs (date_id, industry_id, rs_rating, ranking)
                (select date_id, id as "industry_id",
		        round(industry_rs) as "rs_rating",
		        rank () over (order by industry_rs desc) as "ranking"
		        from industry_rs_view order by id) on conflict(industry_id, date_id) 
                DO UPDATE set rs_rating = EXCLUDED.rs_rating, ranking = EXCLUDED.ranking, updated_at = NOW()""")

    print('Inserted into industry_rs')

    cur.execute("""REFRESH MATERIALIZED VIEW screeners;""")

    conn.commit()

    cur.close()



def close_connection(conn):
    if conn is not None:
        conn.close()
        print('Database connection closed.')

def percentChg(now, before):
    return ((now - before) / abs(before)) * 100

def performance(stock):
    perf = ['', '', '', '', '']
    for i in range(5):
        if stock[i + 5]:
            perf[i] = float(percentChg(stock[4], stock[i + 5]))
        else: 
            perf[i] = perf[i - 1]
    return 0.15 * perf[0] + 0.25 * perf[1] + 0.2 * perf[2] + 0.2 * perf[3] + 0.2 * perf[4]


def to_query_str(tuples):
    args_str = ""
    for tuple in tuples:
        args_str += str(tuple)
        args_str += ","
    return args_str[:-1]


if __name__ == '__main__':
    main('postgresql-data')
    exit()