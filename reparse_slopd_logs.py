from pymongo import MongoClient
import slopd_log_parse
import pprint

#from numpy import numpy
def reparse_entry(existing_entry):
	reparsed = slopd_log_parse.parse_entry(existing_entry['raw'])
	reparsed['_id'] = existing_entry['_id']
	return reparsed

client = MongoClient('localhost', 27017)
db = client.snoopy
logs = db.police_logs

lookup = {}
entries = map(reparse_entry, logs.find(lookup))
for entry in entries:
	existing = logs.update({'_id': entry['_id']}, {'$set': {'type': entry['type']}})
