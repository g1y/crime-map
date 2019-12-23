FROM python:3.7-buster

WORKDIR /usr/share/log-scraper/
COPY ./ /usr/share/log-scraper/

RUN pip --no-cache-dir install -r requirements.txt

CMD ["python", "main.py"]
