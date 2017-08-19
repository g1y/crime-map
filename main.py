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

type_pattern = re.compile("Type: (\S*)\s")
location_pattern = re.compile("Location:(\S*)")
address_pattern = re.compile("Addr: (.*),")
clearance_code_pattern = re.compile("Clearance Code: (\S*)\s")
responsible_officer_pattern = re.compile("Responsible Officer: (\S*, .)")
call_comments_pattern = re.compile("CALL COMMENTS: (.*)\n")

for line in lines:
    entry = {"raw":line}
    match = type_pattern.match(line)
    if match:
        entry["type"] = match.group(1)
    search = location_pattern.search(line)
    if search:
        entry["location"] = search.group(1)
    search = address_pattern.search(line)
    if search:
        entry["address"] = search.group(1)
    search = clearance_code_pattern.search(line)
    if search:
        entry["clearance_code"] = search.group(1)
    search = responsible_officer_pattern.search(line)
    if search:
        entry["responsible_officer"] = search.group(1)
    search = call_comments_pattern.search(line)
    if search:
        entry["call_comments"] = search.group(1)
    logs.insert_one(entry)
