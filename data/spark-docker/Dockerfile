FROM bitnami/spark:latest

COPY ./requirements.txt ./requirements.txt

USER root

RUN apt-get update && apt-get install -y gstreamer1.0-libav libnss3-tools libatk-bridge2.0-0 libcups2-dev libxkbcommon-x11-0 libxcomposite-dev libxrandr2 libgbm-dev libgtk-3-0

RUN pip install --no-cache-dir -r ./requirements.txt

RUN playwright install