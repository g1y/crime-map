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
location_pattern = re.compile("Location:(\S*)\s")
address_pattern = re.compile("Addr: (\S*)\s")
clearance_code_pattern = re.compile("Clearance Code: (\S*)\s")
responsible_officer_pattern = re.compile("Responsible Officer: (\S*)\s")
call_comments_pattern = re.compile("CALL_COMMENTS: (\S*)\s")

for line in lines:
    entry = {"raw":line}
    match = type_pattern.match(line)
    if match:
        entry["type"] = match.group(1)
        print(entry["type"])
    match = location_pattern.match(line)
    if match:
        entry["location"] = match.group(1)
        print(entry["location"])
    match = address_pattern.match(line)
    if match:
        entry["address"] = match.group(1)
        print(entry["address"])
    match = clearance_code_pattern.match(line)
    if match:
        entry["clearance_code"] = match.group(1)
        print(entry["clearance_code"])
    match = responsible_officer_pattern.match(line)
    if match:
        entry["responsible_officer"] = match.group(1)
        print(entry["responsible_officer"])
    match = call_comments_pattern.match(line)
    if match:
        entry["call_comments"] = match.group(1)
        print(entry["call_comments"])
    logs.insert_one(entry)
