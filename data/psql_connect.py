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
    cur.execute('SELECT * from stocks limit 5')

    # display the PostgreSQL database server version
    sql_result = cur.fetchall()
    print(sql_result)
       
	# close the communication with the PostgreSQL
    cur.close()

    # conn.commit()


def close_connection():
    if conn is not None:
        conn.close()
        print('Database connection closed.')



if __name__ == '__main__':
    execute_cursor()
    close_connection()

