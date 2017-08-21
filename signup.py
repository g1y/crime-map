from flask import Flask
from flask import render_template
from flask import request

from pymongo import MongoClient

app = Flask(__name__)

@app.route('/signup', methods=['POST'])
def signup():
    email = request.form['email']
    street = request.form['street']

    signup_entry = {'email': email, 'street': street, 'confirmed': false}
    signup_db = get_db()
    if not signup_db.find_one(signup_entry):
        signup_db.insert_one(signup_entry)

    return "signup complete!"

@app.route('/')
def main_page():
    return render_template('signup.html')

def get_db():
    client = MongoClient('localhost', 27017)
    db = client.snoopy
    return db.signups
