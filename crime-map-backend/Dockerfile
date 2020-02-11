FROM python:3.7-buster

WORKDIR /usr/share/crime-map/

COPY ./requirements.txt /usr/share/crime-map/requirements.txt
RUN pip --no-cache-dir install -r requirements.txt

COPY ./ /usr/share/crime-map/

CMD uwsgi --py-autoreload 1 --socket 0.0.0.0:80 --protocol=http -w wsgi:app
