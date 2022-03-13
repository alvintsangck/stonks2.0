docker-compose up -d
sleep 10
docker exec spark-docker-spark-1 pgrep python | xargs kill
docker exec spark-docker-spark-1 pip install psycopg2-binary
docker exec spark-docker-spark-1 python /opt/bitnami/spark/src/indicators/econ_mongo_to_psql.py
docker exec spark-docker-spark-1 python /opt/bitnami/spark/src/indicators/rates_mongo_to_psql.py
docker exec spark-docker-spark-1 python /opt/bitnami/spark/src/indicators/sentiment_mongo_to_psql.py
docker exec spark-docker-spark-1 python /opt/bitnami/spark/src/indicators/econ_psql_query.py
docker exec spark-docker-spark-1 python /opt/bitnami/spark/src/indicators/rates_psql_query.py
docker exec spark-docker-spark-1 python /opt/bitnami/spark/src/indicators/sentiment_psql_query.py
docker exec spark-docker-spark-1 pgrep python | xargs kill
docker-compose down
