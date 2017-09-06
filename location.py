from pymongo import MongoClient

key_file = open('maps_key.txt')
maps_key = key_file.readline()
assert key_file, 'Maps API key required to run!'

client = MongoClient('localhost', 27017)
db = client.snoopy
logs = db.police_logs

missing_lookup = {'maps_lookup': {'$exists': False}}
log_entries = logs.find(missing_lookup)
for entry in log_entries:
	print(entry)
