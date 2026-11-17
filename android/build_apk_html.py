# Z ../web/gamgol.html udělá assets/index.html pro APK: fonty vložené jako base64, žádné odkazy na web.
import base64, re, os
D = os.path.dirname(os.path.abspath(__file__))
F = os.path.join(D, 'fonts')
fonts = [('Courier Prime','courier-prime',[400,700]),('Gaegu','gaegu',[400,700]),('IBM Plex Sans','ibm-plex-sans',[400,500,600]),('Special Elite','special-elite',[400])]
css = ''
for fam, slug, ws in fonts:
    for w in ws:
        b = base64.b64encode(open(f'{F}/{slug}-latin-{w}-normal.woff2','rb').read()).decode()
        css += f'@font-face{{font-family:"{fam}";font-style:normal;font-weight:{w};font-display:swap;src:url(data:font/woff2;base64,{b}) format("woff2");unicode-range:U+0000-00FF,U+0131,U+0152-0153,U+02BB-02BC,U+02C6,U+02DA,U+02DC,U+2000-206F,U+20AC,U+2122,U+2190-2199,U+2212,U+2215,U+FEFF,U+FFFD}}\n'
g = open(os.path.join(D,'..','web','gamgol.html'), encoding='utf-8').read()
g = re.sub(r'<link rel="stylesheet" href="https://fonts.googleapis.com[^>]*>\n?', '', g)
g = re.sub(r'<title>.*?</title>\n?', '', g, count=1)
assert 'googleapis' not in g and 'http://' not in g.replace('http://www.w3.org','')
head = '<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover"><meta name="theme-color" content="#28475b"><title>Gamgol Substation</title><script>var GG_AUDIO_LOOSE=1;window.GG_LOCAL=1</script><style>'+css+'body{margin:0}[hidden]{display:none!important}</style></head><body>'
os.makedirs(os.path.join(D,'assets'), exist_ok=True)
open(os.path.join(D,'assets','index.html'),'w',encoding='utf-8').write(head+g+'</body></html>')
print(os.path.getsize(os.path.join(D,'assets','index.html')))
# Nahrávky: jednotlivé MP3 z ../audio/mp3 do assets/a/ (jen ty, které jsou v rejstříku hry)
import json, shutil
idx = json.loads(re.search(r"const GG_AUDIO = (\{.*\});", open(os.path.join(D,'..','web','src','audio_index.js'), encoding='utf-8').read()).group(1))
AD = os.path.join(D,'assets','a'); shutil.rmtree(AD, ignore_errors=True); os.makedirs(AD)
for k in idx: shutil.copyfile(os.path.join(D,'..','audio','mp3',k+'.mp3'), os.path.join(AD,k+'.mp3'))
print('nahrávek v APK:', len(idx))
