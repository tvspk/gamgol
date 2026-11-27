#!/usr/bin/env python3
"""Doplňkové karty Mnemo Hooks: slovíčka hry (dřív Card index / Lost & found), která v balíčcích Mnemo Korean nejsou.

Zdroj:   mnemo/doplnky/chNN.tsv  (jeden řádek = jedna karta; sloupce viz hlavička souboru, oddělené tabulátorem)
Výstup:  mnemo/ko-topik3-NNz.json  (stejný formát jako balíčky z projektu, overit: true)
         mnemo/ko-koreny-doplnky.json  (nové kořeny hanja, které v ko-koreny.json nejsou)
Pak:     python3 web/tools/mnemo_build.py && sh web/build.sh  (a nahrát zvuk: audio_list.py, record.py --only m1,…,m14)

Sloupce, které vyplňuje Claude (řádek s prázdným „cs“ se přeskočí, takže jde pracovat po kapitolách):
  cs          český význam                       druh  n (podst. jméno) | v (sloveso) | a (příd. jméno) | f (fráze) | o (ostatní)
  typ         k (původní korejské) | s (sino) | e (výpůjčka) | m (smíšené)
  tema        téma jako v balíčcích kapitoly      priklad_cs  český překlad věty ze hry
  mnemo       háček (krátce, česky)               koreny  slabiky=hanja oddělené mezerou, např. „업무=業務 정=定“;
              nový kořen (není v ko-koreny.json) s českým významem: „무=務:povinnost, služba“
  mnemo_zvuk  hook podle zvuku bez hanja (postup: 01-HOOKY-postup.md v projektu Mnemo Korean); prázdné = bez hooku
  vyslov_hangul  výslovnost hangulem, jen když se liší od zápisu (학년 → 항년)
  vyslovnost  česká transkripce; prázdné = vypočte se z vyslov_hangul / slovo (web/tools/cs_transkripce.py),
              vyplň jen jako ruční opravu (plynulá výslovnost ve frázích, gramatické vzorce)
Kapitola, jejíž hlavička obsahuje sloupec mnemo_zvuk, je zpracovaná: dostane českou výslovnost a verzi 2.
Id karet: ko-topik3-d<kapitola 2 číslice><pořadí řádku 2 číslice>; pořadí řádků proto neměnit (postup hráčů visí na id).
"""
import json, os, re, sys, glob

ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', '..'))
M = os.environ.get('GG_MNEMO_DIR') or os.path.join(ROOT, 'mnemo')
DRUH = {'n': 'podstatne_jmeno', 'v': 'sloveso', 'a': 'pridavne_jmeno', 'f': 'fraze', 'o': 'ostatni'}
TYP = {'k': 'puvodni', 's': 'sino', 'e': 'vypujcka', 'm': 'smisene'}
COLS = ['slovo', 'en', 'priklad', 'cs', 'druh', 'typ', 'tema', 'priklad_cs', 'mnemo', 'koreny', 'mnemo_zvuk', 'vyslov_hangul', 'vyslovnost']
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from cs_transkripce import cs as cs_trans

# romanizace jedné slabiky (Revised Romanization, jen pro id kořene, např. "mu-務")
I = ['g', 'kk', 'n', 'd', 'tt', 'r', 'm', 'b', 'pp', 's', 'ss', '', 'j', 'jj', 'ch', 'k', 't', 'p', 'h']
V = ['a', 'ae', 'ya', 'yae', 'eo', 'e', 'yeo', 'ye', 'o', 'wa', 'wae', 'oe', 'yo', 'u', 'wo', 'we', 'wi', 'yu', 'eu', 'ui', 'i']
F = ['', 'k', 'k', 'k', 'n', 'n', 'n', 't', 'l', 'k', 'm', 'l', 'l', 'l', 'p', 'l', 'm', 'p', 'p', 't', 't', 'ng', 't', 't', 'k', 't', 'p', 't']
def rom(s):
    c = ord(s) - 0xAC00
    if not 0 <= c < 11172: raise ValueError('není hangul: ' + s)
    return I[c // 588] + V[(c % 588) // 28] + F[c % 28]


def main():
    known = json.load(open(os.path.join(M, 'ko-koreny.json'), encoding='utf-8'))['koreny']
    by = {(r['hangul'], r['hanja']): r['id'] for r in known}
    extra_p = os.path.join(M, 'ko-koreny-doplnky.json')
    extra = json.load(open(extra_p, encoding='utf-8'))['koreny'] if os.path.exists(extra_p) else []
    for r in extra: by[(r['hangul'], r['hanja'])] = r['id']
    bad, total = [], 0
    for p in sorted(glob.glob(os.path.join(M, 'doplnky', 'ch*.tsv'))):
        ch = int(re.search(r'ch(\d\d)\.tsv$', p).group(1))
        lines = open(p, encoding='utf-8').readlines()
        done = any(l.startswith('#') and 'mnemo_zvuk' in l for l in lines)   # kapitola už má hooky a zkontrolovanou výslovnost
        rows = [l.rstrip('\n').split('\t') for l in lines if l.strip() and not l.startswith('#')]
        karty = []
        for i, r in enumerate(rows, 1):
            r += [''] * (len(COLS) - len(r)); d = dict(zip(COLS, r))
            if not d['cs'].strip(): continue
            cid = 'ko-topik3-d%02d%02d' % (ch, i)
            if d['druh'] not in DRUH or d['typ'] not in TYP: bad.append(f'{cid} {d["slovo"]}: druh/typ „{d["druh"]}/{d["typ"]}“'); continue
            ks = []
            for spec in d['koreny'].split():
                m = re.fullmatch(r'([가-힣]+)=([^\s:]+)(?::(.+))?', spec)
                if not m or len(m.group(1)) != len(m.group(2)): bad.append(f'{cid}: kořen „{spec}“'); continue
                for syl, han in zip(m.group(1), m.group(2)):
                    rid = by.get((syl, han))
                    if not rid:
                        if not m.group(3): bad.append(f'{cid}: nový kořen {syl}={han} potřebuje význam („{syl}={han}:význam“)'); continue
                        rid = rom(syl) + '-' + han; by[(syl, han)] = rid
                        extra.append({'id': rid, 'hangul': syl, 'hanja': han, 'cs': m.group(3).replace('_', ' ')})
                    if rid not in ks: ks.append(rid)
            vh = d['vyslov_hangul'].strip()
            k = {'id': cid, 'tema': d['tema'] or 'ostatní', 'slovo': d['slovo']}
            if done: k['vyslovnost'] = d['vyslovnost'].strip() or cs_trans(vh or d['slovo'])
            if vh: k['vyslov_hangul'] = vh
            k.update({'cs': d['cs'], 'en': d['en'],
                 'slovni_druh': DRUH[d['druh']], 'frekvence': 2, 'priklad': d['priklad'], 'priklad_cs': d['priklad_cs'],
                 'mnemo': d['mnemo']})
            if d['mnemo_zvuk'].strip(): k['mnemo_zvuk'] = d['mnemo_zvuk'].strip()
            if ks: k['koreny'] = ks
            k.update({'extra': {'typ': TYP[d['typ']]}, 'vyrazeno': False, 'overit': True})
            karty.append(k)
        out = os.path.join(M, 'ko-topik3-%02dz.json' % ch)
        if karty:
            json.dump({'jazyk': 'ko', 'uroven': 'TOPIK 3', 'verze_schematu': 1, 'verze': 2 if done else 1,
                       'zdroj': f'Gamgol Substation: doplňky ke kapitole {ch} (slovíčka hry, která v balíčcích Mnemo Korean chybějí; napsal Claude, k ověření)',
                       'karty': karty}, open(out, 'w', encoding='utf-8'), ensure_ascii=False, indent=1)
            total += len(karty)
        elif os.path.exists(out): os.remove(out)
    if extra:
        json.dump({'jazyk': 'ko', 'verze': 1, 'koreny': extra}, open(extra_p, 'w', encoding='utf-8'), ensure_ascii=False, indent=1)
    for b in bad: print('CHYBA', b)
    print(f'doplňkové karty: {total}, nové kořeny: {len(extra)}')
    sys.exit(1 if bad else 0)


if __name__ == '__main__':
    main()
