FROM python:2.7-wheezy

WORKDIR /usr/share/crime-map/
COPY ./app /usr/share/crime-map/
COPY ./templates /usr/share/crime-map/templates

RUN pip --no-cache-dir install -r requirements.txt

CMD uwsgi --socket 0.0.0.0:80 --protocol=http -w wsgi:app
