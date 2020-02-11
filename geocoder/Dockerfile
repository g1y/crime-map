FROM python:3.8-buster

WORKDIR /usr/share/geocoder/

RUN apt-get update && apt-get install -y pipenv && apt-get clean

COPY ./Pipfile* /usr/share/geocoder/

RUN pipenv install

COPY ./ /usr/share/geocoder/

CMD ["pipenv", "run", "python", "location.py"]
