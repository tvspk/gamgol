#!/usr/bin/env python3
"""Sync between devices through a FAKE GitHub (no real network). Each device = its own browser context (own localStorage).
The page is the GitHub Pages build (index.html, with its CSP) served over http. Real time (no fake clock), so "last changed
wins" is tested with real, different times.
Checks: setup errors (bad token, public repository), first device (new code), joining with the first 4 letters, wrong code,
only ciphertext on "GitHub" (decrypted here with the same HKDF/AES-GCM), budget earned AND spent summed (also changed at the
same time), skills right/wrong summed, sync again changes nothing and uploads nothing, last changed wins per item (Mnemo card,
flashcard box, review schedule, weak skill, half-finished file), union (files, repairs, souvenirs, Lost & found tags),
max (best round), attendance book, join with own progress (take / add), upload by itself after a change, quick upload on
leaving the app, expired token + new token, damaged data of another device, erase / transfer code turn sync off on that
device only, turn off, QR, new-version bar (fake AndroidApp), no sideways scroll at 375 px, no script errors.
Run:  sh web/build.sh && python3 -I web/tools/build_site.py && python3 web/tools/test_sync.py"""
import os, sys, asyncio, json, base64, hashlib, gzip, datetime as dt, threading, functools, http.server, re
from playwright.async_api import async_playwright
from cryptography.hazmat.primitives import hashes
from cryptography.hazmat.primitives.kdf.hkdf import HKDF
from cryptography.hazmat.primitives.ciphers.aead import AESGCM

ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', '..'))
fails = []
def ok(n, c, x=''):
    print(('OK  ' if c else 'FAIL') + ' ' + n + (' | ' + str(x)[:300] if x != '' else ''), flush=True)
    if not c: fails.append(n)

class GH:
    """Just enough of the GitHub REST API (as used by sync.js)."""
    REPO = 'tvspk/gamgol-sync'
    def __init__(s):
        s.tokens = {'github_pat_' + x * 30 for x in 'abc'}
        s.private = True; s.n = 0; s.log = []; s.latest = 'v2.6'
        s.contents = {'README.md': b'# sync'}; s.blobs = {}; s.trees = {}; s.commits = {}; s.refs = {'main': 'f' * 40}
    def sha(s, b=b''):
        s.n += 1; return hashlib.sha1(b + str(s.n).encode()).hexdigest()
    async def handle(s, r):
        req = r.request; u = req.url.split('api.github.com', 1)[1]; m = req.method
        H = {'access-control-allow-origin': '*', 'content-type': 'application/json'}
        def J(o, st=200): return r.fulfill(status=st, headers=H, body=json.dumps(o))
        if m == 'OPTIONS': return await r.fulfill(status=204, headers={**H, 'access-control-allow-headers': '*', 'access-control-allow-methods': '*'})
        if u == '/repos/tvspk/gamgol/releases/latest': return await J({'tag_name': s.latest})
        auth = (await req.all_headers()).get('authorization', '')
        if auth.replace('Bearer ', '') not in s.tokens: return await J({'message': 'Bad credentials'}, 401)
        s.log.append((m, u))
        body = json.loads(req.post_data) if req.post_data else None
        P = '/repos/' + s.REPO
        if u == '/user': return await J({'login': 'tvspk'})
        if u == P: return await J({'full_name': s.REPO, 'private': s.private})
        if not u.startswith(P): return await J({'message': 'Not Found'}, 404)
        u = u[len(P):]
        if u.startswith('/contents/'):
            f = u[len('/contents/'):]
            if m == 'GET': return await (J({'content': base64.b64encode(s.contents[f]).decode()}) if f in s.contents else J({'message': 'Not Found'}, 404))
            if m == 'PUT':
                if f in s.contents: return await J({'message': 'sha wasn’t supplied'}, 422)
                s.contents[f] = base64.b64decode(body['content']); return await J({'content': {}}, 201)
        if u.startswith('/git/matching-refs/heads/'):
            pre = u.split('/heads/', 1)[1]
            return await J([{'ref': 'refs/heads/' + k, 'object': {'sha': v}} for k, v in s.refs.items() if k.startswith(pre)])
        if u.startswith('/git/commits/') and m == 'GET':
            c = s.commits.get(u.split('/')[-1]); return await (J(c) if c else J({'message': 'Not Found'}, 404))
        if u.startswith('/git/trees/') and m == 'GET': return await J({'tree': s.trees[u.split('/')[-1]]})
        if u.startswith('/git/blobs/') and m == 'GET':
            return await r.fulfill(status=200, headers={**H, 'content-type': 'application/octet-stream'}, body=s.blobs[u.split('/')[-1]])
        if u == '/git/blobs' and m == 'POST':
            b = base64.b64decode(body['content']); h = s.sha(b); s.blobs[h] = b; return await J({'sha': h}, 201)
        if u == '/git/trees' and m == 'POST':
            h = s.sha(); s.trees[h] = [{**e, 'type': 'blob'} for e in body['tree']]; return await J({'sha': h}, 201)
        if u == '/git/commits' and m == 'POST':
            h = s.sha(); c = {'sha': h, 'tree': {'sha': body['tree']}, 'parents': body['parents'],
                              'committer': {'date': dt.datetime.now(dt.timezone.utc).strftime('%Y-%m-%dT%H:%M:%SZ')}}
            s.commits[h] = c; return await J(c, 201)
        if u == '/git/refs' and m == 'POST':
            k = body['ref'].replace('refs/heads/', '')
            if k in s.refs: return await J({'message': 'Reference already exists'}, 422)
            s.refs[k] = body['sha']; return await J({}, 201)
        if u.startswith('/git/refs/heads/') and m == 'PATCH':
            k = u.split('/heads/', 1)[1]
            if k not in s.refs: return await J({'message': 'Not Found'}, 422)
            s.refs[k] = body['sha']; return await J({})
        return await J({'message': 'Not Found ' + u}, 404)
    def state_of(s, br, code):
        c = s.commits[s.refs[br]]; e = [x for x in s.trees[c['tree']['sha']] if x['path'] == 'state'][0]; raw = s.blobs[e['sha']]
        key = HKDF(algorithm=hashes.SHA256(), length=32, salt=b'Gamgol sync v1', info=b'state').derive(code.encode())
        return json.loads(gzip.decompress(AESGCM(key).decrypt(raw[:12], raw[12:], b'state')))
    def uploads(s): return sum(1 for m, u in s.log if m == 'POST' and u.endswith('/git/blobs'))

G = GH()
TOK = ['github_pat_' + x * 30 for x in 'abc']

def serve():
    class Q(http.server.SimpleHTTPRequestHandler):
        def log_message(self, *a): pass
    srv = http.server.ThreadingHTTPServer(('127.0.0.1', 0), functools.partial(Q, directory=ROOT))
    threading.Thread(target=srv.serve_forever, daemon=True).start()
    return f'http://127.0.0.1:{srv.server_port}/index.html'

async def device(browser, url, name, android=None):
    ctx = await browser.new_context(viewport={'width': 375, 'height': 800}, service_workers='block')
    p = await ctx.new_page(); p.errs = []; p.name = name
    p.on('pageerror', lambda e: p.errs.append(str(e)))
    p.on('console', lambda m: p.errs.append(m.text) if m.type == 'error' and 'Failed to load resource' not in m.text else None)
    await ctx.route('https://api.github.com/**', G.handle)
    if android:
        await ctx.add_init_script("window.AndroidApp={version:()=>%s,open:u=>{window.__opened=u},copy:()=>{},setDark:()=>{},ttsKo:()=>false,say:()=>{},hush:()=>{}}" % json.dumps(android))
    await p.goto(url)
    await wait(p, "window.__game&&__game.store.state==='on'&&!!document.querySelector('.movebox')")
    return p

async def E(p, js): return await p.evaluate(js)
async def wait(p, js, timeout=15000):
    # polls with evaluate (wait_for_function evaluates a string, which the page's CSP forbids: no 'unsafe-eval')
    t = 0
    while not await p.evaluate(js):
        await asyncio.sleep(0.1); t += 100
        if t > timeout: raise TimeoutError(p.name + ': ' + js)
async def state(p):
    return await E(p, """(()=>{const S=__game.S,Y=__sync.SY,c={};for(const ch in S.cards||{})for(const id in S.cards[ch].b)c[ch+'|'+id]=S.cards[ch].b[id];
      return {w:S.won,n:S.n,cases:Object.keys(S.cases).sort(),rp:Object.keys(S.repairs).sort(),sv:S.souvenirs.slice().sort(),sk:S.skills,reopen:S.reopen,
      rv:S.rv||{},mh:(S.mh||{c:{}}).c,cards:c,best:S.best,vocab:Object.fromEntries(Object.entries(S.vocab).map(([k,v])=>[k,v.w])),att:S.att||null,
      resume:S.resume||null,theme:S.theme||'',on:!!Y,err:Y&&Y.lastError,dev:Y?Object.keys(Y.dev).length:0}})()""")
SAVE = '__sync.save()'

async def open_sync(p):
    await E(p, '__sync.home()'); await p.click('#sylink'); await p.wait_for_selector('.card.sync')

async def setup_first(p, tok):
    await open_sync(p); await p.click('#sy-setup')
    await p.fill('#sy-tok', tok); await p.click('#sy-go')
    await p.wait_for_selector('ol.sy-words')
    words = await p.eval_on_selector_all('ol.sy-words li', 'l=>l.map(x=>x.textContent)')
    await p.click('#sy-saved')
    await wait(p, '__sync.SY&&__sync.SY.joined')
    return ' '.join(words)

async def join(p, tok, code, choice=None):
    await open_sync(p); await p.click('#sy-setup')
    await p.fill('#sy-tok', tok); await p.click('#sy-go')
    await p.wait_for_selector('#sy-code'); await p.fill('#sy-code', code); await p.click('#sy-codego')
    if choice:
        await p.wait_for_selector('#sy-' + choice); await p.click('#sy-' + choice)
    await wait(p, '__sync.SY&&__sync.SY.joined')

async def sync(p): return await E(p, '__sync.syNow(true)')

async def nosideways(p, what):
    w = await E(p, 'document.documentElement.scrollWidth')
    ok(f'{p.name}: no sideways scroll ({what})', w <= 376, w)

async def main():
    url = serve()
    async with async_playwright() as pw:
        b = await pw.chromium.launch()
        A = await device(b, url, 'A')
        ok('board has the Sync button', await E(A, "!!document.getElementById('sylink')"))
        ids = await E(A, """(()=>{const C=__game.C;return {ch:C.chapters.map(c=>c.id),cs:C.chapters.map(c=>c.cases.map(k=>k.id)),rp:C.repairs.map(r=>r.id),
          sk:C.chapters[0].skills,card:__game.deck(C.chapters[0]).map(c=>c.id).slice(0,3)}})()""")
        ch0, ch1 = ids['ch'][0], ids['ch'][1]; cs0, cs1 = ids['cs'][0][0], ids['cs'][1][0]; sk0, sk1 = ids['sk'][0], ids['sk'][1]; card0 = ids['card'][0]
        await open_sync(A); await nosideways(A, 'sync screen')
        ok('no Czech on the sync screen', not re.search('[ěščřžůťďň]', await E(A, 'document.body.innerText')))
        # progress on A before sync
        await E(A, f"""(()=>{{const S=__game.S;S.won=10000;S.cases[{json.dumps(cs0)}]={{closed:true}};S.souvenirs.push('sv-test');S.repairs[{json.dumps(ids['rp'][0])}]=true;
          S.skills[{json.dumps(sk0)}]={{r:5,w:2,s:1,weak:false}};S.n=7;S.rv={{[{json.dumps(sk0)}]:{{b:2,d:'2030-01-01'}}}};S.mh={{c:{{'0001:r':[100,3,250,2,0]}}}};
          S.best[{json.dumps(ch0)}]=40;S.theme='dark';{SAVE}}})()""")
        # errors while setting up
        await open_sync(A); await A.click('#sy-setup'); await A.fill('#sy-tok', 'github_pat_' + 'x' * 30); await A.click('#sy-go')
        await A.wait_for_selector('#sy-err:not([hidden])'); ok('bad token: message', 'invalid' in await A.inner_text('#sy-err'))
        G.private = False; await A.fill('#sy-tok', TOK[0]); await A.click('#sy-go')
        await wait(A, "document.getElementById('sy-err').textContent.includes('public')"); ok('public repository refused', True)
        G.private = True
        code = await setup_first(A, TOK[0])
        ok('8 words', len(code.split()) == 8, code)
        ok('meta file in main', 'gamgol-sync.json' in G.contents)
        meta = json.loads(G.contents['gamgol-sync.json']); ok('meta: app + check, no code inside', meta['app'] == 'Gamgol' and code.split()[0] not in json.dumps(meta))
        brA = [k for k in G.refs if k.startswith('gg-')]; ok('A has its branch', len(brA) == 1, brA)
        raw = b''.join(G.blobs.values()); ok('only ciphertext on GitHub', b'won' not in raw and b'Gamgol' not in raw and b'0001' not in raw)
        st = G.state_of(brA[0], code)
        ok('decrypts with the code; own budget, answers, skill counts', st['app'] == 'Gamgol' and st['own'].get('w') == 10000 and st['own'].get('n') == 7 and st['own'].get('r.' + sk0) == 5, st['own'])
        ok('commit without parents', all(c['parents'] == [] for c in G.commits.values()))
        ok('look is not synced', 'theme' not in json.dumps(st['sets']) and 'dark' not in json.dumps(st))
        ok('token/code not in the saved progress', TOK[0] not in (await E(A, "localStorage.getItem('gamgol-save')")) and code not in (await E(A, "localStorage.getItem('gamgol-save')")))
        tc = await E(A, '__game.makeCode()'); ok('transfer code has no token', TOK[0] not in tc)

        # B: empty device, a wrong code first, then the first 4 letters of each word
        B = await device(b, url, 'B')
        await open_sync(B); await B.click('#sy-setup'); await B.fill('#sy-tok', TOK[1]); await B.click('#sy-go')
        await B.wait_for_selector('#sy-code'); await B.fill('#sy-code', 'abandon ' * 8); await B.click('#sy-codego')
        await B.wait_for_selector('#sy-err:not([hidden])'); ok('wrong code refused', 'match' in await B.inner_text('#sy-err'))
        await B.fill('#sy-code', ' '.join(w[:4] for w in code.split()).upper()); await B.click('#sy-codego'); await wait(B, '__sync.SY&&__sync.SY.joined')
        sb = await state(B)
        ok('B took A’s progress', sb['w'] == 10000 and sb['cases'] == [cs0] and sb['mh'].get('0001:r') == [100, 3, 250, 2, 0] and sb['rv'].get(sk0) == {'b': 2, 'd': '2030-01-01'}, sb)
        ok('B: skills, souvenir, repair, best', sb['sk'].get(sk0) == {'r': 5, 'w': 2, 's': 1, 'weak': False} and 'sv-test' in sb['sv'] and sb['rp'] == [ids['rp'][0]] and sb['best'].get(ch0) == 40, sb['sk'])
        ok('B keeps its own look', sb['theme'] != 'dark', sb['theme'])
        await nosideways(B, 'after join')

        # concurrent: A earns 1000; B earns 500 and spends 3000; both rate the same Mnemo card, B later; skill answers on both
        await E(A, f"(()=>{{const S=__game.S;S.won+=1000;S.mh.c['0001:r']=[200,5,250,3,0];S.skills[{json.dumps(sk0)}].r+=1;S.n+=1;{SAVE}}})()")
        await asyncio.sleep(0.05)
        await E(B, f"""(()=>{{const S=__game.S;S.won+=500;S.won-=3000;S.mh.c['0001:r']=[150,1,230,0,1];S.skills[{json.dumps(sk0)}].w+=1;S.n+=1;
          S.cards={{[{json.dumps(ch0)}]:{{b:{{[{json.dumps(card0)}]:2}},t:{{[{json.dumps(card0)}]:1}},r:1}}}};{SAVE}}})()""")
        for p in (A, B, A): ok(f'{p.name}: sync ok', await sync(p))
        sa, sb = await state(A), await state(B)
        ok('budget summed (10000+1000+500-3000 = 8500) on both', sa['w'] == sb['w'] == 8500, (sa['w'], sb['w']))
        ok('answers summed (7+1+1)', sa['n'] == sb['n'] == 9, (sa['n'], sb['n']))
        ok('skill right/wrong summed', sa['sk'][sk0]['r'] == 6 and sa['sk'][sk0]['w'] == 3 and sb['sk'][sk0] == sa['sk'][sk0], sa['sk'][sk0])
        ok('Mnemo card rated later on B wins on both', sa['mh']['0001:r'] == sb['mh']['0001:r'] == [150, 1, 230, 0, 1], sa['mh'])
        ok('flashcard box from B on A', sa['cards'].get(ch0 + '|' + card0) == 2, sa['cards'])
        n = G.uploads()
        for p in (A, B, A, B): await sync(p)
        sa2 = await state(A)
        ok('sync again: nothing changes', sa2['w'] == 8500 and sa2['mh'] == sa['mh'])
        ok('sync again: nothing uploaded', G.uploads() == n, (n, G.uploads()))

        # weak skill on B (sent back for another look), fixed later on A
        await E(B, f"(()=>{{const S=__game.S;const k=S.skills[{json.dumps(sk1)}]||(S.skills[{json.dumps(sk1)}]={{r:0,w:0,s:0,weak:false}});k.w++;k.weak=true;k.s=0;S.reopen.push({{skill:{json.dumps(sk1)},at:S.n}});{SAVE}}})()")
        await sync(B); await sync(A)
        sa = await state(A); ok('weak skill reached A', sa['sk'][sk1]['weak'] and any(x['skill'] == sk1 for x in sa['reopen']), sa['sk'].get(sk1))
        await E(A, f"(()=>{{const S=__game.S;const k=S.skills[{json.dumps(sk1)}];k.r++;k.s=1;k.weak=false;S.reopen=S.reopen.filter(x=>x.skill!=={json.dumps(sk1)});{SAVE}}})()")
        await sync(A); await sync(B)
        sb = await state(B); ok('fixed skill everywhere', not sb['sk'][sk1]['weak'] and not any(x['skill'] == sk1 for x in sb['reopen']) and sb['sk'][sk1]['r'] == 1 and sb['sk'][sk1]['w'] == 1, sb['sk'][sk1])
        # Lost & found tags (OR), best round (max), attendance book (later day wins, best = max)
        await E(A, f"(()=>{{const S=__game.S;S.vocab[{json.dumps(ch0)}]={{order:[3,1,2],ptr:1,w:{{'3':{{m:1,n:1}}}}}};S.best[{json.dumps(ch0)}]=60;S.att={{day:'2026-11-16',cnt:12,last:'2026-11-16',n:3,best:3,leave:0,log:{{'2026-11-16':'s'}},hit:[3],msg:''}};{SAVE}}})()")
        await E(B, f"(()=>{{const S=__game.S;S.vocab[{json.dumps(ch0)}]={{order:[0],ptr:0,w:{{'3':{{r:1,n:2}},'5':{{m:1,n:1}}}}}};S.att={{day:'2026-11-10',cnt:10,last:'2026-11-10',n:1,best:7,leave:1,log:{{'2026-11-10':'s'}},hit:[3,7],msg:''}};{SAVE}}})()")
        for p in (A, B, A): await sync(p)
        sa, sb = await state(A), await state(B)
        ok('Lost & found tags joined', sa['vocab'][ch0] == sb['vocab'][ch0] == {'3': {'m': 1, 'r': 1, 'n': 2}, '5': {'m': 1, 'n': 1}}, sa['vocab'].get(ch0))
        ok('deal order stays on each device', await E(A, f"__game.S.vocab[{json.dumps(ch0)}].order.join()") == '3,1,2' and await E(B, f"__game.S.vocab[{json.dumps(ch0)}].order.join()") == '0')
        ok('best round: max', sa['best'][ch0] == sb['best'][ch0] == 60)
        at = sb['att']; ok('attendance: later day wins, best max, marks joined', at['last'] == '2026-11-16' and at['n'] == 3 and at['best'] == 7 and sorted(at['hit']) == [3, 7] and at['log'].get('2026-11-10') == 's', at)
        # half-finished file: started on A, closed on B
        await E(A, f"(()=>{{const S=__game.S;S.resume={{ch:{json.dumps(ch1)},cs:{json.dumps(cs1)},phase:1,i:2,inj:[],earned:300,stats:{{}}}};{SAVE}}})()")
        await sync(A); await sync(B)
        ok('half-finished file reached B', (await state(B))['resume'] and (await state(B))['resume']['cs'] == cs1)
        await E(B, f"(()=>{{const S=__game.S;S.cases[{json.dumps(cs1)}]={{closed:true}};delete S.resume;{SAVE}}})()")
        await sync(B); await sync(A)
        sa = await state(A); ok('closed on B: closed on A, nothing half-finished', cs1 in sa['cases'] and sa['resume'] is None, (sa['cases'], sa['resume']))

        # C with its own progress: "Take the progress from my other devices"
        C = await device(b, url, 'C')
        await E(C, f"(()=>{{const S=__game.S;S.won=999;S.cases[{json.dumps(ids['cs'][2][0])}]={{closed:true}};{SAVE}}})()")
        await join(C, TOK[2], code, 'adopt')
        sc = await state(C); ok('C took (no 999, no own file)', sc['w'] == 8500 and ids['cs'][2][0] not in sc['cases'], (sc['w'], sc['cases']))
        await sync(A); ok('A unchanged by C', (await state(A))['w'] == 8500)
        # D with its own progress: "Add this device’s progress"
        D = await device(b, url, 'D')
        await E(D, f"(()=>{{const S=__game.S;S.won=400;S.cases[{json.dumps(ids['cs'][2][0])}]={{closed:true}};S.mh={{c:{{'0002:p':[1,1,250,1,0]}}}};{SAVE}}})()")
        await join(D, TOK[2], code, 'add')
        for p in (A, B, C, D): await sync(p)
        al = [await state(p) for p in (A, B, C, D)]
        ok('D added: budget 8900 on all four', all(s['w'] == 8900 for s in al), [s['w'] for s in al])
        ok('D added: its file and Mnemo card everywhere', all(ids['cs'][2][0] in s['cases'] and '0002:p' in s['mh'] for s in al))
        ok('paired devices: 4', (await state(A))['dev'] == 3)
        await open_sync(A); ok('screen shows 4 devices', 'Paired devices: 4' in await A.text_content('.card.sync'))
        await E(A, '__sync.home()')

        # sync by itself after a change (no button), A picks it up within a minute
        await E(B, f"(()=>{{__sync.R={{screen:'cards'}};__game.S.won+=5;{SAVE}}})()")
        await wait(B, '__sync.SY.lastSync>Date.now()-3000&&__game.S.won===8905', timeout=25000)
        await wait(A, '__game.S.won===8905', timeout=80000)
        ok('upload after a change + A picks it up within a minute', True)
        # on the board: upload ~3 s after a change
        await E(B, f"(()=>{{__sync.home();__sync.R={{screen:'home'}};__game.S.won+=1;{SAVE}}})()"); t0 = await E(B, 'Date.now()')
        await wait(B, f'__sync.SY.lastSync>{t0}', 9000); d = (await E(B, '__sync.SY.lastSync')) - t0; ok('board: uploaded within ~3 s', d < 7000, d)
        # leaving the app: quick upload (no downloads, no branch list)
        await sync(A); await sync(B); n0 = len(G.log)
        await E(A, f"(()=>{{__game.S.won+=7;{SAVE}}})()")
        await E(B, f"(()=>{{__game.S.won+=3;{SAVE};Object.defineProperty(document,'hidden',{{configurable:true,get:()=>true}});Object.defineProperty(document,'visibilityState',{{configurable:true,get:()=>'hidden'}});document.dispatchEvent(new Event('visibilitychange'))}})()")
        await wait(B, '!__sync.busy&&__sync.SY.lastSync>Date.now()-4000', 8000)
        log = G.log[n0:]
        ok('leaving: uploaded', any(m == 'POST' and u.endswith('/git/blobs') for m, u in log), log)
        ok('leaving: no downloads, no branch list', not any(m == 'GET' and ('/git/blobs/' in u or 'matching-refs' in u) for m, u in log), log)
        await E(B, "delete document.hidden;delete document.visibilityState")
        await sync(A); await sync(B); sa, sb = await state(A), await state(B)
        ok('after leaving: both 8916', sa['w'] == sb['w'] == 8916, (sa['w'], sb['w']))

        # expired token on A → message, new token
        G.tokens.discard(TOK[0]); await sync(A)
        await open_sync(A); ok('expired token shown', 'expired' in await A.inner_text('#sy-st'))
        ok('Enter a new token button', await E(A, "!document.getElementById('sy-tok-btn').hidden"))
        await E(A, '__sync.home()'); ok('board button warns', '⚠' in await E(A, "document.getElementById('sylink').textContent"))
        G.tokens.add(TOK[0] + 'z'); await open_sync(A); await A.click('#sy-tok-btn'); await A.fill('#sy-tok', TOK[0] + 'z'); await A.click('#sy-go')
        await wait(A, "__sync.SY.token.endsWith('z')&&!__sync.SY.lastError", timeout=10000); ok('new token works', True)

        # damaged data from another device: the rest syncs
        bad = G.sha(); G.blobs[bad] = b'\x00' * 40; t = G.sha(); G.trees[t] = [{'path': 'state', 'type': 'blob', 'sha': bad, 'mode': '100644'}]
        cm = G.sha(); G.commits[cm] = {'sha': cm, 'tree': {'sha': t}}; G.refs['gg-0000000000bb'] = cm
        await E(A, f"(()=>{{__game.S.won+=4;{SAVE}}})()"); await sync(A)
        await sync(B); sb = await state(B); ok('damaged branch: rest synced, message', sb['err'] == 'damaged' and sb['w'] == 8920, (sb['err'], sb['w']))
        del G.refs['gg-0000000000bb']; await sync(B); ok('damaged branch gone: no message', not (await state(B))['err'])

        # erase all progress on D: only D wiped, sync off there, others keep everything
        await E(D, '__sync.home()'); await D.click('#reset'); await D.click('#reset')
        sd = await state(D); ok('erase on D: wiped, sync off', sd['w'] == 0 and not sd['on'], (sd['w'], sd['on']))
        ok('erase note on the board', 'turned off' in await D.inner_text('.movebox'))
        await sync(A); ok('A keeps its budget after D’s erase', (await state(A))['w'] == 8920)
        # loading a transfer code on C: sync off there
        await E(C, f"__game.backupScreen('in')"); await C.fill('#code', tc); await C.click('#chk'); await C.click('#load')
        sc = await state(C); ok('transfer code on C: loaded, sync off', sc['w'] == 10000 and not sc['on'], (sc['w'], sc['on']))
        await sync(A); ok('A unchanged by C’s code', (await state(A))['w'] == 8920)
        # turn off on B
        await open_sync(B); await B.click('#sy-off'); await B.click('#sy-offyes')
        ok('turn off on B', not (await state(B))['on'] and 'off' in await B.inner_text('.card.sync'))

        # pairing code screen + QR (shown on request; content = GAMGOL: + words in capitals)
        await open_sync(A); await A.click('#sy-code-btn'); await A.click('#sy-qrb')
        ok('QR shown', await E(A, "!!document.querySelector('.sy-qrimg svg')"))
        await nosideways(A, 'QR')
        ok('QR library reads GAMGOL code', await E(A, "typeof GGQR.encode==='function'"))

        # new-version bar (APK only)
        Z = await device(b, url, 'Z', android='2.5')
        await Z.wait_for_selector('#upbar', timeout=10000); ok('new version bar', '2.6' in await Z.inner_text('#upbar'))
        await Z.click('#up-get'); ok('download opens the release', await E(Z, 'window.__opened') == 'https://github.com/tvspk/gamgol/releases/latest/download/gamgol.apk')
        Y = await device(b, url, 'Y', android='2.6')
        await Y.wait_for_timeout(5000); ok('same version: no bar', not await E(Y, "!!document.getElementById('upbar')"))
        W = await device(b, url, 'W')
        await W.wait_for_timeout(4500); ok('web (no app): no bar', not await E(W, "!!document.getElementById('upbar')"))

        for p in (A, B, C, D, Z, Y, W):
            ok(f'{p.name}: no script errors', not p.errs, p.errs[:3])
        await b.close()
    print('\n' + ('ALL SYNC TESTS PASSED' if not fails else f'{len(fails)} FAILED: ' + ', '.join(fails)))
    sys.exit(1 if fails else 0)

asyncio.run(main())
