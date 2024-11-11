s = []
with open('PhishBenignDataset.csv', 'r', encoding='utf8') as f:
    s = f.readlines()

w = []
for i in s:
    try:
        if int(i.strip()[-1]) == 0:
            w.append(i.strip()[:-2]+"\n")
    except: pass

with open('db.txt', 'w', encoding='utf8') as f:
    f.writelines(w[:500])