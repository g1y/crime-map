FROM python:3.8-buster

WORKDIR /usr/share/log-scraper/

RUN apt-get update && apt-get install -y pipenv && apt-get clean

COPY ./Pipfile* /usr/share/log-scraper/
RUN pipenv install

COPY ./ /usr/share/log-scraper/

CMD ["pipenv", "run", "python", "main.py"]
