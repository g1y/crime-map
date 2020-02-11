#!/bin/sh
set -e
set -u

docker build -t crime-map-backend .
docker tag crime-map-backend g1ymoore/crime-map:crime-map-backend
docker push g1ymoore/crime-map:crime-map-backend

kubectl rollout restart deployment.apps/crime-map-backend
kubectl rollout status deployment.apps/crime-map-backend
