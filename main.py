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

client = MongoClient('localhost', 27017)
db = client.test
logs = db.police_logs

for line in lines:
    pattern = re.compile("Type: (.*)\s")
    match = pattern.match(line)
    if match:
        entry_type = match.group(0)
        print(entry_type)
    entry_location = re.findall("Location:(.*)\n$", line)
    entry = {"raw":line, "type": entry_type, "location": entry_location}
    #logs.insert_one(entry)
