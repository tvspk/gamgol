# Česká transkripce korejštiny pro pole "vyslovnost" (kopie claude/02-cs-transkripce.py z projektu Mnemo Korean).
# Vstup: hangul podle výslovnosti (pole vyslov_hangul, jinak slovo).
# Pravidla: ㄱㄷㅂㅈ na začátku slova a po neznělé souhlásce k t p č,
# mezi znělými hláskami g d b dž; přídechové kch tch pch čch;
# napjaté kk tt pp ss čč; ㄹ = r před samohláskou, jinak l (ㄹㄹ = ll);
# ㅓ = ŏ, ㅡ = ŭ (háčky odlišují ㅓ/ㅗ a ㅡ/ㅜ); ㅐ, ㅔ = e; ㅚ, ㅙ, ㅞ = we.
# Koncové souhlásky se neutralizují (k t p), koncovka + ㅇ se převádí
# do další slabiky. Asimilace (nosovky, přídech, napjatost) se berou
# z vyslov_hangul, sám je převodník nedomýšlí.
# Navíc oproti projektu: zdvojené písmeno ze známé chyby (akkki, nattta, matčči) se opraví (fix_triple).
# Použití: python3 cs_transkripce.py balicek.json [...]  (vypíše návrhy)
import sys, json, re

CHO = ['k','kk','n','t','tt','r','m','p','pp','s','ss','','č','čč','čch','kch','tch','pch','h']
JUNG = ['a','e','ja','je','ŏ','e','jŏ','je','o','wa','we','we','jo','u','wŏ','we','wi','ju','ŭ','ŭi','i']
JONG = [None,'k','k','k','n','n','n','t','l','k','m','l','l','l','p','l','m','p','p','t','t','ng','t','t','k','t','p','t']
JONG_LIAISON = [None,0,1,(0,9),2,(2,12),(2,18),3,5,(5,0),(5,6),(5,7),(5,9),(5,16),(5,17),(5,18),6,7,(7,9),9,10,None,12,14,15,16,17,18]
VOICED_MAP = {'k':'g','t':'d','p':'b','č':'dž'}

def syllables(word):
    out = []
    for ch in word:
        c = ord(ch) - 0xAC00
        if 0 <= c < 11172:
            out.append([c // 588, (c % 588) // 28, c % 28])
        else:
            out.append(ch)
    return out

def liaison(syl):
    for i in range(len(syl) - 1):
        a, b = syl[i], syl[i + 1]
        if isinstance(a, list) and isinstance(b, list) and a[2] and b[0] == 11:
            l = JONG_LIAISON[a[2]]
            if l is None:
                continue
            if isinstance(l, tuple):
                keep = {(0,9):1,(2,12):4,(2,18):4,(5,0):8,(5,6):8,(5,7):8,(5,9):8,(5,16):8,(5,17):8,(5,18):8,(7,9):17}[l]
                a[2] = keep; b[0] = l[1]
            else:
                a[2] = 0; b[0] = l
    return syl

def word_cs(word):
    syl = liaison(syllables(word))
    res = []
    prev_voiced = False
    prev_l = False
    for s in syl:
        if not isinstance(s, list):
            res.append(s); prev_voiced = False; prev_l = False
            continue
        cho, jung, jong = s
        c = CHO[cho]
        if cho == 5:
            c = 'l' if prev_l else 'r'
        elif c in VOICED_MAP and prev_voiced:
            c = VOICED_MAP[c]
        res.append(c + JUNG[jung])
        f = JONG[jong]
        if f:
            res.append(f)
        prev_voiced = (f is None) or f in ('n', 'm', 'ng', 'l')
        prev_l = (f == 'l')
    return ''.join(res)

def fix_triple(s):
    s = re.sub(r'([kpst])\1\1', r'\1\1', s)
    return s.replace('tčč', 'čč')

def cs(text):
    return fix_triple(' '.join(word_cs(w) for w in text.split(' ')))

if __name__ == '__main__':
    for p in sys.argv[1:]:
        d = json.load(open(p, encoding='utf-8'))
        for k in d['karty']:
            src = k.get('vyslov_hangul') or k['slovo']
            print(k['id'], k['slovo'], '|', k.get('vyslovnost'), '→', cs(src))
