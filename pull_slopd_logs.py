import pycurl
from StringIO import StringIO
from pymongo import MongoClient

buffer = StringIO()
c = pycurl.Curl()
c.setopt(c.URL, 'http://pdreport.slocity.org/policelog/rpcdsum.txt')
c.setopt(c.WRITEDATA, buffer)
c.perform()
c.close()

body = buffer.getvalue()
parsed = parse_log(body)

client = MongoClient('localhost', 27017)
db = client.snoopy
logs = db.police_logs

for entry in parsed:
    existing = logs.find_one(entry)
    if not existing:
        logs.insert(entry)
    else:
        print("skipping, already exists")
