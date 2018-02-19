from flask import Flask
from flask import render_template
from flask import request
from flask import send_file

import json
from bson import json_util
from bson.binary import Binary

from pymongo import MongoClient

import time

app = Flask(__name__)

@app.route('/')
def main_page():
    return render_template('map.html')

@app.route('/entries')
def entries():
	cutoff = time.time() - (4 * 86400)
	db = get_logs_db()
	logs = list(db.find({'timestamp': {'$gt': cutoff}}))
	return json.dumps(logs, default=json_util.default)

@app.route('/log')
def log():
	requestedDate = request.args['date']
	db = get_logs_db()
	logs = list(db.find({'date': requestedDate}))
	return json.dumps(logs, default=json_util.default)

@app.route('/js/bundle.js')
def send_js():
	return send_file('dist/bundle.js')

def get_db():
		client = MongoClient('localhost', 27017)
		db = client.snoopy
		logs = db.signups
		return logs

def get_logs_db():
		client = MongoClient('localhost', 27017)
		db = client.snoopy
		logs = db.police_logs
		return logs
