#!/bin/sh
set -e
set -u

env="$1"

docker build -t crime-map-backend .
docker tag crime-map-backend g1ymoore/crime-map:crime-map-backend
docker tag crime-map-backend g1ymoore/crime-map:crime-map-backend-dev

if [ "${env}" = "prod" ]; then
	docker push g1ymoore/crime-map:crime-map-backend
fi

kubectl rollout restart deployment.apps/crime-map-backend
kubectl rollout status deployment.apps/crime-map-backend
