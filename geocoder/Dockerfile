FROM python:2.7-wheezy

WORKDIR /usr/share/geocoder/

COPY ./ /usr/share/geocoder/

RUN pip --no-cache-dir install -r requirements.txt

CMD bash -c "while python location.py; do sleep 2h; done"
