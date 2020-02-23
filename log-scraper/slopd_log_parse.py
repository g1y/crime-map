import re
import pprint
import datetime

def parse_log(log_contents):
	separator = '={79}'
	lines = re.split(separator, log_contents)
	combined = combine_header_body(lines)
	return map(parse_entry, combined)

report_num_pattern          = re.compile("([0-9]+)\s")
date_pattern                = re.compile("[0-9]+\s([0-9\/]+)\s")
received_pattern            = re.compile("Received:([0-9]{2}:[0-9]{2})\s")
dispatched_pattern          = re.compile("Dispatched:([0-9]{2}:[0-9]{2})\s")
arrived_pattern             = re.compile("Arrived:([0-9]{2}:[0-9]{2})\s")
cleared_pattern             = re.compile("Cleared:([0-9]{2}:[0-9]{2})\s")
type_pattern                = re.compile("Type:\s*([a-zA-Z0-9]+)")
location_pattern            = re.compile("Location:(\S*)")
address_pattern             = re.compile("Addr: (.*)Clearance Code")
grid_pattern                = re.compile("; GRID (.*)(,|;)")
clearance_code_pattern      = re.compile("Clearance Code: (\S*)\s")
responsible_officer_pattern = re.compile("Responsible Officer: (\S*, .)")
call_comments_pattern       = re.compile("CALL COMMENTS: (.*)\n")
description_pattern         = re.compile("Des:(.*)incid")

def parse_entry(line):
	entry = {'raw': line}

	match = report_num_pattern.match(line)
	if match:
		entry["report_number"] = match.group(1)

	match = date_pattern.search(line)
	if match:
		dateString = match.group(1)
		entry["date"] = dateString
		month, day, yearSmall = re.split(r"\/", dateString)
		year = f"20{yearSmall}"
		date = datetime.datetime(int(year), int(month), int(day))
		timestamp = date.timestamp()
		entry["timestamp"] = int(timestamp)

	if search := received_pattern.search(line):
		entry["received"] = search.group(1)

	if search := dispatched_pattern.search(line):
		entry["received"] = search.group(1)

	if search := arrived_pattern.search(line):
		entry["arrived"] = search.group(1)

	if search := cleared_pattern.search(line):
		entry["cleared"] = search.group(1)

	if search := type_pattern.search(line):
		entry["type"] = search.group(1)

	if search := location_pattern.search(line):
		entry["location"] = search.group(1)

	if search := address_pattern.search(line):
		address_line = search.group(1)
		address_sections = re.split(";", address_line)
		entry["address"] = address_sections[0]

	if search := clearance_code_pattern.search(line):
		entry["clearance_code"] = search.group(1)

	if search := responsible_officer_pattern.search(line):
		entry["responsible_officer"] = search.group(1)

	if search := call_comments_pattern.search(line):
		entry["call_comments"] = search.group(1)

	if search := description_pattern.search(line):
		entry["description"] = search.group(1)

	return entry

# It's hard to split on every nth occurence so splitting up the header and
# body and then recombining is how I decided to shortcut that.
def combine_header_body(lines):
	combined_lines = []
	header = ""
	body_pattern = re.compile('Type:\s')
	header_pattern = re.compile(".*Received:.*Dispatched:")
	total = 0
	for line in lines:
		if body_match := body_pattern.search(line):
			total += 1
			event = header + line
			combined_lines.append(event)
		elif header_match := header_pattern.search(line):
			header = line

	return combined_lines
