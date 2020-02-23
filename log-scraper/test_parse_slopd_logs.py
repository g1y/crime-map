import unittest
import slopd_log_parse
import io

from main import Scraper

class TestParseSLOPDLogs(unittest.TestCase):
	def setUp(self):
		self.scraper = Scraper()
		self.scraper.fetch_log = lambda: raise_(Exception("Should not call this function! Do not want to load a public service unnecessarily"))

		with open('sample_slopd_log_1.txt', 'r') as sample_file:
			sample_log = sample_file.read()
			self.scraper.parse_logs(sample_log)

	def test_parse_log_address(self):
		sample_file = open('sample_slopd_log.txt', 'r')
		sample_log = sample_file.read()
		parsed = slopd_log_parse.parse_log(sample_log)
		for entry in parsed:
			self.assertIn('address', entry)
		sample_file.close()

	def test_parse_date_and_time(self):
		entry = self.scraper.pulled_log[0]
		self.assertIn("timestamp", entry)

	def test_scraper(self):
		self.assertIsNotNone(self.scraper.pulled_log)
		self.assertGreater(len(self.scraper.pulled_log), 0)