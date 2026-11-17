# Gamgol Substation · 감골 파출소

Hra na procvičování korejštiny podle učebnice **세종한국어 회화 3**: jsi nová strážnice na venkovské služebně Gamgol,
uzavíráš spisy, opravuješ služebnu a cestou opakuješ slovíčka, gramatiku a poslech. Hra je v korejštině a angličtině,
sekce Mnemo Hooks je česky. Korejský zvuk je strojově generovaný (Supertonic 3 od Supertone Inc., licence OpenRAIL-M).

- **Android:** [poslední verze `gamgol.apk`](https://github.com/tvspk/gamgol/releases/latest/download/gamgol.apk).
  Instaluje se přes předchozí verzi, postup zůstává. Aplikace sama nabídne novou verzi.
- **Web:** https://tvspk.github.io/gamgol/ (funguje i offline po prvním otevření).

## Synchronizace mezi zařízeními

Postup se přenáší mezi telefonem, tabletem a počítačem **šifrovaně přes vlastní soukromý repozitář na GitHubu**
(žádný server, GitHub vidí jen zašifrovaná data). Nastavuje se jednou v každém zařízení: na hlavní nástěnce dole
*Your progress → Sync between devices*. Potřeba je token GitHubu jen pro soukromý repozitář schránky a párovací kód
(8 slov nebo QR kód), který vytvoří první zařízení. Token ani kód se nikam neposílají a nejsou v přenosových kódech.

Pravidla slučování a technické podrobnosti: `CLAUDE.md` a komentář na začátku `web/src/sync.js`.

## Struktura

| Cesta | Obsah |
|---|---|
| `web/src/` | obsah hry (`content*.js`, `verbs_ch*.js`, `cards_ch*.js`, `reads_ch*.js`, `mnemo_data.js`), logika (`engine.js`, `mnemo.js`), synchronizace (`sync.js`, `qr.js`), vzhled |
| `web/build.sh` | sestaví `web/gamgol.html` |
| `web/tools/` | nahrávání zvuku, generátory, testy (`t1–t3`, `tc`, `test_sync.py`, `test_qr.py`), `build_site.py` (web na Pages) |
| `audio/bundles/` | nahrávky v balících po kapitolách |
| `mnemo/` | balíčky Mnemo Hooks (zdroj pro `mnemo_data.js`) |
| `android/` | aplikace pro Android (WebView), `build.sh`, `verze.txt` |
| `index.html`, `sw.js`, `manifest.webmanifest` | web na GitHub Pages (vygenerované) |
