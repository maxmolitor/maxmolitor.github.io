import os
import os.path
import json
import codecs
import shutil
import math
from PIL import Image

up = os.path.dirname

here = up(__file__)
cards = os.path.join(here, 'cards')

def get_mip_map_size(width, height):
    divisor = 4.0
    if width > 512 and height > 512:
        divisor = 8.0
    if width > 1024 and height > 1024:
        divisor = 32.0

    w = int(math.ceil(width / divisor) * divisor)
    h = int(math.ceil(height / divisor) * divisor)
    return w, h

def reduce():
    for name in os.listdir(cards):
        infile = os.path.join(cards, name, name+'.jpg')
        outfile = os.path.join(cards, name, name+'.jpeg')
        if os.path.exists(outfile):
            os.remove(outfile)
        if os.path.exists(infile):
            img = Image.open(infile)
            w, h = img.size
            limit = 1500 # 1500
            while w > limit or h > limit:
                w /= 2
                h /= 2
            #w, h = get_mip_map_size(w, h)
            print infile, img.size, '->', w, h
            img.thumbnail((w,h), Image.ANTIALIAS)
            img.save(outfile)

def revert():
    for name in os.listdir(cards):
        infile = os.path.join(cards, name, name+'.jpg')
        if os.path.exists(infile):
            os.system('svn revert ' + infile)
            print 'svn revert ' + infile

#revert()
reduce()
