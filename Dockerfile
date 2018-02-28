FROM python:2.7-wheezy

WORKDIR /usr/share/crime-map/
COPY . /usr/share/crime-map/

RUN pip --no-cache-dir install -r requirements.txt

CMD uwsgi --socket 0.0.0.0:80 --protocol=http -w wsgi:app
