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
    return render_template('map2.html')

@app.route('/entries')
def entries():
	cutoff = time.time() - (15 * 86400)
	db = get_logs_db()
	logs = list(db.find({'timestamp': {'$gt': cutoff}}))
	return json.dumps(logs, default=json_util.default)

@app.route('/log')
def log():
	requestedDate = request.args['date']
	db = get_logs_db()
	logs = list(db.find({'date': requestedDate}))
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
	KEY_ID = "44ZR4U8G69"
	f = open('./AuthKey.p8', 'r')
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
