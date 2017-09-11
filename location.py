from pymongo import MongoClient
from googlemaps import googlemaps

import re

key_file = open('maps_key.txt')
maps_key = re.sub('\n', '', key_file.readline())
assert maps_key, 'Maps API key required to run!'

client = MongoClient('localhost', 27017)
db = client.snoopy
logs = db.police_logs

gmaps_client = googlemaps.Client(key=maps_key)

missing_lookup = {'maps_geocode': {'$exists': False}, 'address': {'$exists': True}}
log_entries = logs.find(missing_lookup)
for key, entry in enumerate(log_entries):
	print(entry[u'address'])
	geocode_result = gmaps_client.geocode(entry[u'address'])
	print(geocode_result)
	if geocode_result:
		log_entries[key].maps_lookup = geocode_result
		print("going to update")
		print(geocode_result)
		logs.update({'_id': entry._id}, {'$set': {'maps_geocode': geocode_result}}, {'upsert': True})
