FROM bitnami/spark:latest

# RUN apt-get update && apt-get install -y curl vim wget software-properties-common ssh net-tools ca-certificates python3 python3-pip python3-numpy python3-matplotlib python3-scipy python3-pandas python3-simpy

COPY ../requirements.txt .

USER root

RUN pip install --no-cache-dir -r ./requirements.txt