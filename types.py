from sklearn.neighbors import NearestNeighbors
import numpy as np
import textmining as tm

from pymongo import MongoClient

import json
from bson import json_util
from bson.binary import Binary

def create_tdm(entries):
	tdm = tm.TermDocumentMatrix()
	for entry in entries:
		tdm.add_doc(entry[u'call_comments'])

	tdm.add_doc("BATTERY WITH SERIOUS BODILY INJURY (F)")

	return tdm

def get_logs_db():
	client = MongoClient('mongodb', 27017)
	db = client.snoopy
	logs = db.police_logs
	return logs

def get_entries():
	logs = get_logs_db()
	return logs.find({'call_comments': {'$exists': True}})

def get_entry_tdm_list():
	entries = get_entries()
	tdm = create_tdm(entries).rows(cutoff=1)
	next(tdm)
	list_tdm = [list(item) for item in tdm]
	return list_tdm

def training_time():
	nbs = NearestNeighbors(n_neighbors=5)
	tdm = get_entry_tdm_list()
	nbs = nbs.fit(list(tdm))
	distances, indices = nbs.kneighbors(tdm)
	print(distances[-1])
	

training_time()
