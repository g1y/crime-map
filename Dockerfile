FROM python:latest

COPY . /usr/share/crime-map

WORKDIR /usr/share/crime-map

RUN apt-get update
RUN apt-get install virtualenv -y
RUN /bin/bash -c "source ./bin/activate; pip install -r requirements.txt"

CMD uwsgi --socket 0.0.0.0:80 --protocol=http -w wsgi:app
