import unittest
import slopd_log_parse

class TestParseSLOPDLogs(unittest.TestCase):
	def test_parse_log_address(self):
		sample_file = open('sample_slopd_log.txt', 'r')
		sample_log = sample_file.read()
		parsed = slopd_log_parse.parse_log(sample_log)
		for entry in parsed:
				self.assertIn('address', entry)
		sample_file.close()
