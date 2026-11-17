# Poslechová stránka: audio/listen/poslech.html + audio/listen/audio/*.mp3 (kopie balíků).
# Obsahuje jen nahrané věty. Použití: python3 web/tools/listen_page.py
import json, os, re, shutil
ROOT = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
A = os.path.join(ROOT, "audio"); OUT = os.path.join(A, "listen")
L = json.load(open(os.path.join(A, "list.json"), encoding="utf-8"))
idx = json.loads(re.search(r"const GG_AUDIO = (\{.*\});", open(os.path.join(ROOT, "web/src/audio_index.js"), encoding="utf-8").read()).group(1))
rows = [[x["k"], x["b"], x["v"], x["t"], x["kind"], x["ref"]] for x in L if x["k"] in idx]
data = json.dumps({"rows": rows, "idx": idx}, ensure_ascii=False, separators=(",", ":")).replace("</", "<\\/")
tpl = open(os.path.join(ROOT, "web/tools/listen_template.html"), encoding="utf-8").read()
os.makedirs(os.path.join(OUT, "audio"), exist_ok=True)
open(os.path.join(OUT, "poslech.html"), "w", encoding="utf-8").write(tpl.replace("/*DATA*/", data))
for b in sorted({v[0] for v in idx.values()}): shutil.copyfile(os.path.join(A, "bundles", b + ".mp3"), os.path.join(OUT, "audio", b + ".mp3"))
print(len(rows), "nahrávek,", len({v[0] for v in idx.values()}), "balíků")
