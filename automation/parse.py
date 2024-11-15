import re
import json

s = ""
with open('result.txt', 'r') as f:
    s = f.read().replace('\n', '').strip()

results = re.findall(r'{.*?}', s)
for i in range(len(results)):
    results[i] = results[i].replace('website:', '"website":').replace('dns:', '"dns":').replace('db:', '"db":').replace('cert:', '"cert":').replace('ml:', '"ml":').replace('url:', '"url":').replace('true', 'True').replace('false', "False")

with open('merged.json', 'w') as f:
    f.write(json.dumps(results, indent=4))
    