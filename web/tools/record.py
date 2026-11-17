# Nahrávání korejských vět pro Gamgol (Supertonic 3, hlasy F1 a M1, rychlost 0.92;
# Mnemo Hooks má hlasy "F1/0.85" a "M1/0.85": stejné hlasy, rychlost 0.85, balíky m1 … m14).
#
#   python3 web/tools/audio_list.py                 # nejdřív: seznam vět z kódu hry -> audio/list.json
#   python3 web/tools/record.py                     # nahraje chybějící, složí balíky a rejstřík
#   python3 web/tools/record.py --only u1,k1        # jen vybrané balíky
#   python3 web/tools/record.py --takes KEY [KEY..] # 3 nové pokusy do audio/takes/ (k výběru)
#   python3 web/tools/record.py --pick KEY N        # vybraný pokus N nahradí audio/mp3/KEY.mp3
#
# Pravidla: existující audio/mp3/<klíč>.mp3 se NIKDY nepřepíše (kromě --pick). Klíč = FNV-1a(hlas|text),
# stejně jako audioKey() v engine.js. Výstup: audio/mp3/*.mp3 (pro APK), audio/bundles/<balík>.mp3
# (pro artefakt: MP3 za sebou), web/src/audio_index.js ({klíč: [balík, posun, délka]}), audio/check.tsv.
import json, os, sys, subprocess, tempfile, shutil, time
ROOT = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
A = os.path.join(ROOT, "audio"); MP3 = os.path.join(A, "mp3"); BUN = os.path.join(A, "bundles"); TAKES = os.path.join(A, "takes")
MODEL = os.environ.get("GAMGOL_TTS_MODEL", "/home/claude/tts/model")   # onnx/ + voice_styles/ ze Supertone/supertonic-3
SPEED, STEPS = 0.92, 8
FFA = ("silenceremove=start_periods=1:start_threshold=-45dB,areverse,"
       "silenceremove=start_periods=1:start_threshold=-45dB,areverse,apad=pad_dur=0.15")

def fnv(s):
    h = 0x811c9dc5
    for b in s.encode("utf-8"): h ^= b; h = (h * 0x01000193) & 0xffffffff
    return "%08x" % h

_tts, _st = None, {}
def synth(v, t, out):
    global _tts
    if _tts is None:
        from supertonic import TTS
        _tts = TTS(model="supertonic-3", model_dir=MODEL, auto_download=False)
    name, _, sp = v.partition("/")               # "F1" = game speed; "F1/0.85" = Mnemo Hooks, own speed
    if name not in _st: _st[name] = _tts.get_voice_style(name)
    wav, _ = _tts.synthesize(t, voice_style=_st[name], lang="ko", speed=float(sp) if sp else SPEED, total_steps=STEPS)
    with tempfile.TemporaryDirectory() as d:
        w = os.path.join(d, "t.wav"); _tts.save_audio(wav, w)
        subprocess.run(["ffmpeg", "-y", "-loglevel", "error", "-i", w, "-af", FFA, "-ac", "1", "-ar", "44100",
                        "-b:a", "48k", "-id3v2_version", "0", "-map_metadata", "-1", out + ".part.mp3"], check=True)
    os.replace(out + ".part.mp3", out)

def dur(p):
    r = subprocess.run(["ffprobe", "-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", p], capture_output=True, text=True)
    return float(r.stdout.strip() or 0)

def load():
    L = json.load(open(os.path.join(A, "list.json"), encoding="utf-8"))
    for x in L: assert fnv(x["v"] + "|" + x["t"]) == x["k"], ("klíč nesedí", x)
    return L

def record(L, only):
    os.makedirs(MP3, exist_ok=True)
    todo = [x for x in L if (not only or x["b"] in only) and not os.path.exists(os.path.join(MP3, x["k"] + ".mp3"))]
    t0 = time.time()
    for i, x in enumerate(todo):
        synth(x["v"], x["t"], os.path.join(MP3, x["k"] + ".mp3"))
        if i % 50 == 49: print(f"  {i+1}/{len(todo)}  {time.time()-t0:.0f} s", flush=True)
    print("nahráno nových:", len(todo))

def bundle(L):
    os.makedirs(BUN, exist_ok=True); idx, groups = {}, {}
    for x in L:
        if os.path.exists(os.path.join(MP3, x["k"] + ".mp3")): groups.setdefault(x["b"], []).append(x["k"])
    for b, keys in groups.items():
        data, off = bytearray(), 0
        for k in keys:
            m = open(os.path.join(MP3, k + ".mp3"), "rb").read(); idx[k] = [b, len(data), len(m)]; data += m
        old = os.path.join(BUN, b + ".mp3")
        if not (os.path.exists(old) and open(old, "rb").read() == bytes(data)): open(old, "wb").write(data); print("  balík změněn:", b, len(data) // 1024, "kB")
    js = "/* Rejstřík nahrávek, generuje web/tools/record.py. {klíč: [balík, posun, délka]} */\nconst GG_AUDIO = " + json.dumps(idx, separators=(",", ":")) + ";\n"
    open(os.path.join(ROOT, "web", "src", "audio_index.js"), "w", encoding="utf-8").write(js)
    print("rejstřík:", len(idx), "nahrávek v", len(groups), "balících")

def check(L):
    # rychlý test: sekundy na slabiku. Useknuté nebo roztažené nahrávky vybočí. Špatnou výslovnost to nepozná.
    rows = []
    for x in L:
        p = os.path.join(MP3, x["k"] + ".mp3")
        if not os.path.exists(p): continue
        syl = sum(1 for c in x["t"] if "가" <= c <= "힣"); d = dur(p); r = d / max(syl, 1)
        rows.append((r, d, syl, x))
    if not rows: return
    rs = sorted(r for r, *_ in rows); med = rs[len(rs) // 2]
    bad = [(r, d, s, x) for r, d, s, x in rows if r < med * 0.6 or r > med * 1.7 or (s <= 3 and d > 2.5)]
    with open(os.path.join(A, "check.tsv"), "w", encoding="utf-8") as f:
        f.write("klíč\tbalík\thlas\tslabik\tsekund\ts/slabiku\ttext\n")
        for r, d, s, x in sorted(bad, key=lambda z: -abs(z[0] / med - 1)): f.write(f'{x["k"]}\t{x["b"]}\t{x["v"]}\t{s}\t{d:.2f}\t{r:.3f}\t{x["t"]}\n')
    print(f"kontrola délek: medián {med:.3f} s/slabiku, podezřelých {len(bad)} -> audio/check.tsv")

def takes(L, keys, n=3):
    os.makedirs(TAKES, exist_ok=True); by = {x["k"]: x for x in L}
    for k in keys:
        for i in range(1, n + 1): synth(by[k]["v"], by[k]["t"], os.path.join(TAKES, f"{k}-{i}.mp3"))
        print("pokusy:", k, by[k]["t"])

if __name__ == "__main__":
    a = sys.argv[1:]; L = load()
    if a[:1] == ["--takes"]: takes(L, a[1:]); sys.exit()
    if a[:1] == ["--pick"]:
        shutil.copyfile(os.path.join(TAKES, f"{a[1]}-{a[2]}.mp3"), os.path.join(MP3, a[1] + ".mp3")); print("vybráno:", a[1], a[2])
        bundle(L); sys.exit()
    only = set(a[a.index("--only") + 1].split(",")) if "--only" in a else None
    record(L, only); bundle(L); check(L)
