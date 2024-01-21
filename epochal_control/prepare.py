import os.path
import json
import codecs
import shutil

up = os.path.dirname

here = up(__file__)
data = os.path.join(here, 'data.txt')
material = os.path.join(here, 'material')
removed = os.path.join(here, 'removed')
xml = os.path.join(up(up(os.path.abspath(here))), 'var', 'eyevisit')
print(xml)

all = dict()
for line in open(data):
    d = eval( 'dict(' + line.strip() + ')')
    d['tags'] = d['tags'].split('\t')
    while 'x' in d['tags']:
        d['tags'].remove('x')
    n = d['number']
    key = str(n).zfill(3)
    xmlpath = os.path.join(xml, key)
    if not os.path.exists(xmlpath):
        print("Skipping", xmlpath)
        continue

    all[n] = d
    audio = os.path.join(material, 'audio%i.aifc' % n)
    output = os.path.join(material, 'audio%i.mp4' % n)
    if os.path.exists(audio):
        if not os.path.exists(output):
            cmd = "ffmpeg -i %s -vcodec h264 -acodec aac -strict -2  %s"
            #cmd = "ffmpeg -i %s -codec:a libmp3lame -qscale:a 2 %s"
            os.system(cmd % (audio, output))
        target = os.path.join(removed, 'audio%i.aifc' % n)
        shutil.move(audio, target)
    if os.path.exists(output):
        d['audio'] = 'audio%i.mp4' % n
    else:
        d['audio'] = None
with codecs.open('data.json', 'w', encoding='utf-8') as f:
    json.dump(list(all.values()), f, ensure_ascii=False, indent=4)
print('ok')
