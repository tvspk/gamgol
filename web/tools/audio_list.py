# Vypíše všechno, co se má nahrát, přímo z kódu hry: audioList() v engine.js (stejné funkce jako přehrávání).
# Použití: python3 web/tools/audio_list.py  -> audio/list.json
import json, os, sys
from playwright.sync_api import sync_playwright
D = os.path.dirname(os.path.abspath(__file__)); W = os.path.dirname(D); OUT = os.path.join(os.path.dirname(W), "audio", "list.json")
with sync_playwright() as p:
    b = p.chromium.launch(); pg = b.new_page(); errs = []
    pg.on("pageerror", lambda e: errs.append(str(e)))
    pg.goto("file://" + os.path.join(W, "test.html")); pg.wait_for_timeout(1500)
    L = pg.evaluate("window.__game.audioList()"); b.close()
if errs: print("CHYBY NA STRÁNCE:", errs); sys.exit(1)
os.makedirs(os.path.dirname(OUT), exist_ok=True)
json.dump(L, open(OUT, "w", encoding="utf-8"), ensure_ascii=False, indent=0)
from collections import Counter
print(len(L), "nahrávek;", dict(Counter(x["kind"] for x in L)), dict(Counter(x["v"] for x in L)))
print("znaků:", sum(len(x["t"]) for x in L))
