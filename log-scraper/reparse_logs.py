import sys
import pprint

from pymongo import MongoClient
import slopd_log_parse


if len(sys.argv) != 2:
	print("Usage: reparse_Logs <field to update>")
	sys.exit(1)

def reparse_entry(existing_entry):
	reparsed = slopd_log_parse.parse_entry(existing_entry['raw'])
	reparsed['_id'] = existing_entry['_id']
	return reparsed

client = MongoClient('mongodb', 27017)
db = client.snoopy
logs = db.police_logs

lookup = {}
entries = map(reparse_entry, logs.find(lookup))
field = sys.argv[1]
for entry in entries:
	existing = logs.update({'_id': entry['_id']}, {'$set': {field: entry[field]}})
