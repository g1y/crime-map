from signup import app

app.config.update(
    CELERY_BROKER_URL='redis://localhost:6379',
    CELERY_RESULT_BACKEND='redis://localhost:6379'
)


celery = make_celery(app)
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

@celery.task()
def send_confirmation_email(email):
    token = create_confirmation_token(email)
    mail = Mail()
    mail.init_app(app)
    link = 'mooreguy.com/confirm?email=' + email + '&token=' + token
    anchor = '<a href="' + link + '">Confirm here!</a>'
    msg = Message(anchor, sender="noreply@mooreguy.com", recipients=email)
    mail.send(msg)
    return

def create_confirmation_token(email):
    token = os.urandom(20)
    client = MongoClient('mongodb', 27017)
    signups = get_db()
    signups.update({'email': email}, {'$set': {'confirmation_token': Binary(token)}}, upsert=False)
    return token
