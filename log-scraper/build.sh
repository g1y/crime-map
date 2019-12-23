docker build -t log-scraper .
docker tag log-scraper g1ymoore/crime-map:log-scraper
docker push g1ymoore/crime-map:log-scraper
