#!/bin/sh
set -e
set -u
set -o pipefail

docker build -t geocoder .
docker tag geocoder g1ymoore/crime-map:geocoder
docker push g1ymoore/crime-map:geocoder
