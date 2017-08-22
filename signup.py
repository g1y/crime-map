from flask import Flask
from flask import render_template
from flask import request

from celery import Celery

from pymongo import MongoClient

def make_celery(app):
    celery = Celery(app.import_name, backend=app.config['CELERY_RESULT_BACKEND'],
        broker=app.config['CELERY_BROKER_URL'])
    celery.conf.update(app.config)
    TaskBase = celery.Task
    class ContextTask(TaskBase):
        abstract = True
        def __call__(self, *args, **kwargs):
            with app.app_context():
                return TaskBase.__call__(self, *args, **kwargs)
    celery.Task = ContextTask
    return celery

app = Flask(__name__)
app.config.update(
    CELERY_BROKER_URL='redis://localhost:6379',
    CELERY_RESULT_BACKEND='redis://localhost:6379'
)

celery = make_celery(app)

@celery.task()
def send_confirmation_email(email):
    # need to implement email sending
    return

@app.route('/signup', methods=['POST'])
def signup():
    email = request.form['email']
    street = request.form['street']

    signup_entry = {'email': email, 'street': street, 'confirmed': False}
    signup_db = get_db()
    if not signup_db.find_one(signup_entry):
        signup_db.insert_one(signup_entry)

    send_confirmation_email(email)

    return render_template('confirmation.html', email=email)

@app.route('/')
def main_page():
    return render_template('signup.html')

def get_db():
    client = MongoClient('localhost', 27017)
    db = client.snoopy
    return db.signups
