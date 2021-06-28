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
import os

app = Flask(__name__)

@app.route('/')
def main_page():
    if os.getenv("FLASK_ENV") == "development":
        frontend_root = "http://localhost:8080"
    else:
        frontend_root = "https://crime-map.sfo2.cdn.digitaloceanspaces.com"

    return render_template('index.html', frontend_root=frontend_root, environment=os.getenv("FLASK_ENV"))


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

@app.route('/services/jwt')
def sign_jwt():
    with open('./secrets/private-key', 'r') as private_key, open('./secrets/issuer-id') as issuer_id, open('./secrets/key-id') as key_id:
        key_id_val = key_id.read().strip()
        issuer_id_val = issuer_id.read().strip()
        private_key_val = private_key.read().strip()
        jwt_headers = {
            'alg': "ES256",
            'kid': key_id_val,
            'typ': "JWT"
        }

        claims = {
            'iss': issuer_id_val,
            'iat': time.time(),
            'exp': time.time() + 20 * 60,
        }

        return jwt.encode(claims, key=private_key_val, algorithm="ES256", headers=jwt_headers)


def get_db():
    client = get_mongo_client()
    db = client.snoopy
    logs = db.signups
    return logs

def get_logs_db():
    client = get_mongo_client()
    db = client.snoopy
    logs = db.police_logs
    return logs

def get_mongo_client():
    mongo_host = os.getenv('MONGO_HOST') or 'mongodb'
    mongo_port = os.getenv('MONGO_PORT') or 27017
    return MongoClient(mongo_host, mongo_port)
