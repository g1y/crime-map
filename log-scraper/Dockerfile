FROM python:2.7-wheezy

WORKDIR /usr/share/log-scraper/
COPY ./ /usr/share/log-scraper/

RUN pip --no-cache-dir install -r requirements.txt

CMD bash -c "while python pull_slopd_logs.py; do sleep 2h; done"