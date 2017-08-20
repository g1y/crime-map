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

separator = '={79}\s\n'
expression = separator
lines = re.split(expression, body)

client = MongoClient('localhost', 27017)
db = client.test
logs = db.police_logs

def parse_entry(line):
    entry = {"raw":line}

    type_pattern = re.compile("Type: (\S*)\s")
    location_pattern = re.compile("Location:(\S*)")
    address_pattern = re.compile("Addr: (.*),")
    clearance_code_pattern = re.compile("Clearance Code: (\S*)\s")
    responsible_officer_pattern = re.compile("Responsible Officer: (\S*, .)")
    call_comments_pattern = re.compile("CALL COMMENTS: (.*)\n")

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

    return entry

# It's hard to split on every nth occurence so splitting up the header and
# body and then recombining is how I decided to shortcut that.
def combine_header_body(lines):
    combined_lines = []
    current_entry = ""
    for line in lines:
        body_pattern = re.compile("Type: (\S*)\s")
        header_pattern = re.compile(".*Received:.*Dispatched:")
        body_match = body_pattern.match(line)
        header_match = header_pattern.match(line)
        if body_match:
            current_entry = current_entry + line
            combined_lines.append(current_entry)
        elif header_match:
            current_entry = line

    return combined_lines

combined = combine_header_body(lines)
