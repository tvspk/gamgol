#!/usr/bin/env python3
"""Web version for GitHub Pages (branch main, folder / root): index.html, sw.js, manifest.webmanifest.

Usage:  python3 -I web/tools/build_site.py           (after sh web/build.sh)
        python3 -I web/tools/build_site.py --check   (fails when the files in the repository are not up to date)

- index.html = web/gamgol.html with the fonts embedded (as in the APK, nothing loaded from Google), window.GG_LOCAL
  (progress in this browser + sync through GitHub), recordings from the bundles in audio/bundles/, a strict CSP:
  the only outside address is https://api.github.com (sync and nothing else), no 'unsafe-eval'.
- sw.js: network first, offline from the cache. Its version is the hash of index.html, so a new page replaces the old cache.
"""
import base64, hashlib, json, os, re, sys

ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', '..'))
FONTS = [('Courier Prime', 'courier-prime', [400, 700]), ('Gaegu', 'gaegu', [400, 700]),
         ('IBM Plex Sans', 'ibm-plex-sans', [400, 500, 600]), ('Special Elite', 'special-elite', [400])]
CSP = ("default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; font-src 'self' data:; "
       "img-src 'self' data: blob:; media-src 'self' data: blob:; connect-src 'self' https://api.github.com; "
       "worker-src 'self'; manifest-src 'self'; base-uri 'none'; form-action 'none'; object-src 'none'")


def page():
    css = ''
    for fam, slug, ws in FONTS:
        for w in ws:
            b = base64.b64encode(open(os.path.join(ROOT, 'android', 'fonts', f'{slug}-latin-{w}-normal.woff2'), 'rb').read()).decode()
            css += (f'@font-face{{font-family:"{fam}";font-style:normal;font-weight:{w};font-display:swap;'
                    f'src:url(data:font/woff2;base64,{b}) format("woff2")}}\n')
    g = open(os.path.join(ROOT, 'web', 'gamgol.html'), encoding='utf-8').read()
    g = re.sub(r'<link rel="stylesheet" href="https://fonts.googleapis.com[^>]*>\n?', '', g)
    g = re.sub(r'<title>.*?</title>\n?', '', g, count=1)
    assert 'fonts.googleapis' not in g
    head = ('<!doctype html><html lang="en"><head><meta charset="utf-8">'
            '<meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover">'
            f'<meta http-equiv="Content-Security-Policy" content="{CSP}">'
            '<meta name="referrer" content="no-referrer"><meta name="theme-color" content="#28475b">'
            '<link rel="manifest" href="manifest.webmanifest"><link rel="icon" href="web/site/icon-192.png">'
            '<link rel="apple-touch-icon" href="web/site/icon-192.png"><title>Gamgol Substation</title>'
            '<script>window.GG_WEB_VER="' + open(os.path.join(ROOT, 'android', 'verze.txt'), encoding='utf-8').read().split()[1] + '";window.GG_LOCAL=1;window.GG_AUDIO_BASE="audio/bundles/";'
            'if("serviceWorker" in navigator&&location.protocol==="https:")addEventListener("load",function(){navigator.serviceWorker.register("sw.js").catch(function(){})})</script>'
            '<style>' + css + 'body{margin:0}[hidden]{display:none!important}</style></head><body>')
    return head + g + '</body></html>'


def files():
    html = page()
    ver = hashlib.sha256(html.encode()).hexdigest()[:16]
    manifest = json.dumps({'name': 'Gamgol Substation', 'short_name': 'Gamgol', 'start_url': './', 'scope': './',
                           'display': 'standalone', 'background_color': '#e9e0c8', 'theme_color': '#28475b',
                           'icons': [{'src': 'web/site/icon-192.png', 'sizes': '192x192', 'type': 'image/png'},
                                     {'src': 'web/site/icon-512.png', 'sizes': '512x512', 'type': 'image/png'}]},
                          ensure_ascii=False, indent=1) + '\n'
    sw = f"""/* Gamgol Substation on GitHub Pages: network first, offline from the cache. Made by web/tools/build_site.py. */
const V = 'gamgol-{ver}', CORE = ['./', 'index.html', 'manifest.webmanifest', 'web/site/icon-192.png', 'web/site/icon-512.png'];
self.addEventListener('install', e => {{ e.waitUntil(caches.open(V).then(c => c.addAll(CORE)).then(() => self.skipWaiting())); }});
self.addEventListener('activate', e => {{ e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k !== V).map(k => caches.delete(k)))).then(() => self.clients.claim())); }});
self.addEventListener('fetch', e => {{
  const r = e.request; if (r.method !== 'GET' || new URL(r.url).origin !== location.origin) return;
  e.respondWith(fetch(r).then(res => {{ if (res.ok && res.type === 'basic') {{ const cp = res.clone(); caches.open(V).then(c => c.put(r, cp)); }} return res; }})
    .catch(() => caches.match(r, {{ ignoreSearch: true }}).then(m => m || (r.mode === 'navigate' ? caches.match('index.html') : Response.error()))));
}});
"""
    return {'index.html': html, 'sw.js': sw, 'manifest.webmanifest': manifest, '.nojekyll': ''}


def main():
    check = '--check' in sys.argv
    bad = []
    for name, text in files().items():
        p = os.path.join(ROOT, name)
        if check:
            if not os.path.exists(p) or open(p, encoding='utf-8').read() != text:
                bad.append(name)
        else:
            open(p, 'w', encoding='utf-8').write(text)
    if check and bad:
        sys.exit('web for GitHub Pages is out of date (' + ', '.join(bad) + '): run sh web/build.sh && python3 -I web/tools/build_site.py')
    print('site: ' + ('up to date' if check else 'written') + ' (index.html, sw.js, manifest.webmanifest, .nojekyll)')


if __name__ == '__main__':
    main()
