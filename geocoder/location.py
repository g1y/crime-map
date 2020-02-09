from pymongo import MongoClient
import googlemaps

import re
import os


class Geocoder:
    def __init__(self):
        env_path = os.getenv('MAPS_KEY_PATH')
        maps_key_path = '/usr/share/crime-map/secrets/google-maps-key' if not env_path else env_path

        with open(maps_key_path) as key_file:
            maps_key = re.sub('\n', '', key_file.readline())
            assert maps_key, 'Maps API key required to run!'
            self.gmaps_client = googlemaps.Client(key=maps_key)

        self.mongo_client = MongoClient('mongodb')

    def __enter__(self):
        return self

    def __exit__(self, type, value, traceback):
        self.mongo_client.close()
        self.gmaps_client.session.close()

    def create_mongo_client(self):
        db = self.mongo_client.snoopy
        logs = db.police_logs
        return logs

    def add_coordinates_to_entry(self, geocode_result):
        self.mongo_client.update({
            u'_id': geocode_result[u'_id']
        }, {
            '$set': {
                'maps_geocode': geocode_result
            }
        }, upsert=True).close()

    # Everything in this police log is from San Luis Obispo
    def geocode_address(self, address):
        geocode = self.gmaps_client.geocode(address + ", San Luis Obispo, California")
        return geocode

    def extract_address(self, entry):
        return entry[u'address']

    def geocode(self):
        missing_lookup = {'maps_geocode': {'$exists': False}, 'address': {'$exists': True}}
        session = self.mongo_client
        log_entries = session.find(missing_lookup)
        for _, entry in enumerate(log_entries):
            address = self.extract_address(entry)
            geocode_result = self.geocode_address(address)
            if geocode_result:
                print("going to update " + address)
                print(geocode_result)
                self.add_coordinates_to_entry(geocode_result)

        session.close()
        print("finished geocoding")