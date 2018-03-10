from flask import Flask
from flask import render_template
from flask import request
from flask import send_file

from pymongo import MongoClient

import json
from bson import json_util
from bson.binary import Binary

import os

import time

app = Flask(__name__)

@app.route('/signup', methods=['POST'])
def signup():
    email = request.form['email']
    street = request.form['street']

    signup_entry = {'email': email, 'street': street, 'confirmed': False}
    signup_db = get_db()
    if not signup_db.find_one(signup_entry):
        signup_db.insert_one(signup_entry)

    #send_confirmation_email(email)

    #return render_template('confirmation.html', email=email)
	return "feature coming soon"

@app.route('/confirm', methods=['GET'])
def confirm():
    email = request.get('email')
    token = request.get('token')

    signup_db = get_db()
    if signup_db.find_one({'email': email, 'token': token}):
        signup_db.update({'email': email}, {'$set': {'confirmed': True}})
        return "You're confirmed!"
    else:
        return "Invalid confirmation link"

@app.route('/')
def main_page():
    return render_template('map.html')

@app.route('/map')
def map():
    return render_template('map.html')

@app.route('/phpmyadmin/')
def lol():
	return ":D"

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
		client = MongoClient('mongodb', 27017)
		db = client.snoopy
		logs = db.signups
		return logs

def get_logs_db():
		client = MongoClient('mongodb', 27017)
		db = client.snoopy
		logs = db.police_logs
		return logs


if __name__ == "__main__":
    app.run()
