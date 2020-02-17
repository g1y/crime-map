import sentry_sdk
sentry_sdk.init("https://1ffbb5ff89b440338e3112310ac30750@sentry.io/1864498")

import io
import json

import pycurl
from pymongo import MongoClient
from kafka import KafkaProducer


import slopd_log_parse

buffer = io.BytesIO()
c = pycurl.Curl()
c.setopt(c.URL, 'https://pdreport.slocity.org/policelog/rpcdsum.txt')
c.setopt(c.WRITEDATA, buffer)
c.perform()
c.close()

body = buffer.getvalue().decode('iso-8859-1')
print("Parsing logs")
parsed = slopd_log_parse.parse_log(body)
print("Logs parsed")

print("Connecting to mongodb")
client = MongoClient('mongodb')
db = client.snoopy
logs = db.police_logs

producer = KafkaProducer(bootstrap_servers='kafka:9092',
		value_serializer=lambda v: json.dumps(v).encode('utf-8'))

totalInserted = 0
totalEntries = 0
for entry in parsed:
	totalEntries += 1
	existing = logs.find_one({"report_number": entry["report_number"]})
	if not existing:
		id = logs.insert_one(entry).inserted_id
		try:
			producer.send('log-entries', {'id': id})
		except Exception as e:
			sentry_sdk.capture_exception(e)

		totalInserted = totalInserted + 1

print("finished scraping " +  str(totalInserted) + "/" + str(totalEntries) + " logs")
