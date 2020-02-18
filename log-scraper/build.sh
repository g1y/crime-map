docker build -t log-scraper .
docker tag log-scraper g1ymoore/crime-map:log-scraper
docker push g1ymoore/crime-map:log-scraper

kubectl delete job test-log-scrape
kubectl create job test-log-scrape --from cronjob/log-scraper

pod="$(kubectl get pods | grep test-log-scrape | awk '{print $1}')"
echo "Waiting for pod ${pod} to be Ready"
kubectl wait --for=condition=Ready "pod/${pod}"
kubectl logs -f "${pod}"
