docker-compose up -d
sleep 20
docker exec spark-docker-spark-1 pgrep python | xargs kill
docker exec spark-docker-spark-1 python /opt/bitnami/spark/src/print_date.py
docker-compose down

# docker exec spark-docker-spark-1 python /opt/bitnami/spark/src/yfinance_to_mongo.py
# docker exec spark-docker-spark-1 python /opt/bitnami/spark/src/mongo_to_postgres.py
