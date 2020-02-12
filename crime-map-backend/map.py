from flask import Flask
from flask import render_template
from flask import request
from flask import send_file

import json
from bson import json_util
from bson.binary import Binary

from pymongo import MongoClient

import jwt
import time

app = Flask(__name__)

@app.route('/')
def main_page():
    return render_template('index.html')


@app.route('/entries')
def entries():
	days_string = request.args['days']
	print(days_string)
	try:
		days = int(days_string)
	except:
		return "Invalid days"

	cutoff = time.time() - (days * 86400)
	print(cutoff)

	db = get_logs_db()
	logs = list(db.find({'timestamp': {'$gt': cutoff}}))

	return json.dumps(logs, default=json_util.default)

@app.route('/dates_with_entries')
def dates_with_entries():
	dates_with_entries = dict()
	db = get_logs_db()
	end_of_today = (time.time() - (time.time() % 86400)) + 86400
	previous_days = [end_of_today - (x * 86400) for x in range(1,8)]
	for previous_day_end in previous_days:
		day_before_previous_day_end = previous_day_end - 86400
		entry = list(db.findOne({'timestamp': {'$gt': day_before_previous_day_end, '$lt': previous_day_end}}).sort({'timestamp': 1}))
		if False == entry:
			entry = 0

		dates_with_entries[time.strftime("%d-%m", previous_day_end)] = entry

@app.route('/log')
def log():
	requestedDate = request.args['date']
	db = get_logs_db()
	logs = list(db.find({'date': requestedDate}))
	return json.dumps(logs, default=json_util.default)

@app.route('/categories')
def categories():
	db = get_logs_db()
	logs = list(db.distinct('type', {}))
	return json.dumps(logs, default=json_util.default)

@app.route('/search')
def search():
	title = request.args['title']
	db = get_logs_db()
	logs = list(db.find({'type': title}))
	return json.dumps(logs, default=json_util.default)

@app.route('/js/bundle.js')
def send_js():
	return send_file('dist/bundle.js')

@app.route('/js/bundle.js.map')
def send_js_source_map():
	return send_file('dist/bundle.js.map')

@app.route('/services/jwt')
def sign_jwt():
	# Team ID
	ISSUER_ID = "C52AZ3BA5P"
	KEY_ID = "RZGS2V73AJ"
	f = open('./secrets/AuthKey.p8', 'r')
	key = f.read()
	f.close()

	jwt_headers = {
		'alg': "ES256",
		'kid': KEY_ID,
		'typ': "JWT"
	}

	claims = {
		'iss': ISSUER_ID,
		'iat': time.time(),
		'exp': time.time() + 20 * 60,
	}

	return jwt.encode(claims, key=key, algorithm="ES256", headers=jwt_headers)


def get_db():
		client = MongoClient('mongodb', 27017)
		db = client.snoopy
		logs = db.signups
		return logs

def get_logs_db():
		client = MongoClient('mongodb', 27017)
		db = client.snoopy
		logs = db.police_logs
		return logs
