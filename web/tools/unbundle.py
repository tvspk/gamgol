# Obnoví audio/mp3/<klíč>.mp3 z balíků audio/bundles/*.mp3 podle web/src/audio_index.js.
# Pro případ, že jednotlivé MP3 chybí (do předávacího ZIPu se nevejdou). Existující soubory nepřepisuje.
import json, os, re
ROOT = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
idx = json.loads(re.search(r"const GG_AUDIO = (\{.*\});", open(os.path.join(ROOT, "web/src/audio_index.js"), encoding="utf-8").read()).group(1))
os.makedirs(os.path.join(ROOT, "audio/mp3"), exist_ok=True); B, n = {}, 0
for k, (b, off, ln) in idx.items():
    out = os.path.join(ROOT, "audio/mp3", k + ".mp3")
    if os.path.exists(out): continue
    if b not in B: B[b] = open(os.path.join(ROOT, "audio/bundles", b + ".mp3"), "rb").read()
    open(out, "wb").write(B[b][off:off + ln]); n += 1
print("obnoveno:", n, "z", len(idx))
