import sentry_sdk
sentry_sdk.init("https://1ffbb5ff89b440338e3112310ac30750@sentry.io/1864498")

import io
import json
import sys
import logging
logging.basicConfig()
logger = logging.getLogger('Scraper')

import pycurl
from pymongo import MongoClient
from kafka import KafkaProducer

import slopd_log_parse


class Scraper:
	def __init__(self):
		if 'unittest' not in sys.modules:
			self.producer = KafkaProducer(bootstrap_servers='kafka-cluster:9092',
					value_serializer=lambda v: json.dumps(v).encode('utf-8'))

			logger.info("Connecting to mongodb")
			client = MongoClient('mongodb')
			self.logs = client.snoopy.police_logs

		self.pulled_log = []

	def fetch_log(self):
		buffer = io.BytesIO()
		c = pycurl.Curl()
		c.setopt(c.URL, 'https://pdreport.slocity.org/policelog/rpcdsum.txt')
		c.setopt(c.WRITEDATA, buffer)
		c.perform()
		c.close()
		body = buffer.getvalue().decode('iso-8859-1')
		return body

	def parse_logs(self, log):
		logger.info("Parsing logs")
		parsed = slopd_log_parse.parse_log(log)
		logger.info("Logs parsed")

		self.pulled_log = list(parsed)

	def send_out_logs(self):
		totalInserted = 0
		totalEntries = 0
		log = self.fetch_log()

		self.parse_logs(log)
		parsed = self.pulled_log

		for entry in parsed:
			totalEntries += 1
			existing = self.logs.find_one({"report_number": entry["report_number"]})
			if not existing:
				id = self.logs.insert_one(entry).inserted_id
				logger.info(f"{id} - inserting entry")
				try:
					#producer.send('log-entries', {'id': id})
					logger.info(f"{id} - not sent to kafka broker")
				except Exception as e:
					sentry_sdk.capture_exception(e)

				totalInserted = totalInserted + 1

		logger.info(f"finished scraping. Created entries: {str(totalInserted)}. Total scraped: {str(totalEntries)}")


if __name__ == "__main__":
	scraper = Scraper()
	scraper.send_out_logs()