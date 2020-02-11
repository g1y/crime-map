FROM python:3.7-buster

WORKDIR /usr/share/log-scraper/

COPY ./requirements.txt /usr/share/log-scraper/
RUN pip --no-cache-dir install -r requirements.txt

COPY ./ /usr/share/log-scraper/

CMD ["python", "main.py"]
