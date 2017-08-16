import pycurl
import re
from pymongo import MongoClient

from StringIO import StringIO

buffer = StringIO()
c = pycurl.Curl()
c.setopt(c.URL, 'http://pdreport.slocity.org/policelog/rpcdsum.txt')
c.setopt(c.WRITEDATA, buffer)
c.perform()
c.close()

body = buffer.getvalue()

separator = '={79}\s\n.*\n.*\n'
expression = separator
lines = re.split(expression, body)
lines = lines[1:]
lines = lines[:len(lines)]

print(lines[-2:])

client = MongoClient('localhost', 27017)
db = client.test
logs = db.police_logs

for line in lines:
    entry = {"raw":line}
    logs.insert_one(entry)
