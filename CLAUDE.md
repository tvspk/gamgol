# Pravidla pro práci na Gamgol Substation (tento repozitář je VEŘEJNÝ)

Hra na učení korejštiny podle učebnice **세종한국어 회화 3** (14 kapitol, se zvukem a sekcí Mnemo Hooks).
Uživateli odpovídej **česky**. Uživatel není programátor: kroky na GitHubu mu dávej po jednom a čekej na „hotovo“.

## Bezpečnost a soukromí
- **Žádné osobní údaje** v repozitáři: skutečná jména, e-maily, věk, vztahy, názvy účtů. V ukázkách obecná jména.
- **Nikdy do repozitáře** podpisový klíč (`*.jks`), jeho heslo, token GitHubu, párovací kód (8 slov) ani přenosový kód
  (`GG1.…`). Klíč a heslo jsou jen v soukromém předávacím balíčku uživatele a v GitHub Secrets
  (`GAMGOL_KEYSTORE` = base64 `gamgol.jks`, alias `gamgol`; `GAMGOL_KEYSTORE_PASSWORD`). Workflow to kontroluje.
- Podpis APK vždy **původním klíčem** (otisk SHA-256 `5013f733e5b2e87a778a8bc738954248af6cdcd74f4e165e1bf31f97cb7259ae`).
  Jiný klíč = aktualizace se přes starou aplikaci nenainstaluje a postup v telefonu by se ztratil. Nový klíč nikdy negeneruj.

## Sestavení a vydání
- Zdroje: `web/src/` (obsah, `engine.js`, `mnemo.js`, `sync.js`, `qr.js`, `style.css`), nahrávky `audio/bundles/`,
  Android `android/`.
- `sh web/build.sh` → `web/gamgol.html` (stránka pro artefakt na claude.ai) a `web/test.html` (testy).
- `python3 -I web/tools/build_site.py` → `index.html`, `sw.js`, `manifest.webmanifest` (web na GitHub Pages, větev `main`,
  kořen). **Po každé změně zdrojů je spusť a commitni**, workflow jinak selže (`--check`).
- **Nové APK:** zvyš `android/verze.txt` („versionCode versionName“, versionCode vždy +1), push do `main` → GitHub
  Actions sestaví APK, ověří certifikát a vydá `v<versionName>` se souborem `gamgol.apk`. Aplikace pak sama nabídne
  novou verzi (jednou za 20 h `releases/latest`). Místně: `sh android/build.sh` (potřebuje klíč v `android/gamgol.jks`
  a heslo v `android/KEYSTORE_PASSWORD.txt` nebo `GAMGOL_KS_PASS`; nástroje si stáhne z npm a ověří SHA-256).
- Artefakt na claude.ai (možnosti `db` a `user`, postup podle účtu): publikuj `web/gamgol.html` + balíky
  `audio/bundles/*.mp3` jako `audio/<balík>.mp3`. V artefaktu se synchronizace přes GitHub nezapíná.

## Synchronizace mezi zařízeními (`web/src/sync.js`)
- Jen v APK a na webu z GitHub Pages (`window.GG_LOCAL`), ne v artefaktu. Schránka = **soukromý** repozitář
  `tvspk/gamgol-sync` (token jen pro něj, Contents: read and write). Protokol jako MemoChat / Želví sudoku / Gorsaf
  (skill „synchronizace-pres-github“): `gamgol-sync.json` v `main`, větev `gg-<12 hex>` pro každé zařízení, soubor
  `state` = AES-256-GCM(gzip(JSON)), HKDF salt `Gamgol sync v1`, 8 slov BIP39, QR `GAMGOL:` + slova.
- **Pravidla slučování (dohodnutá s uživatelem 17. 11. 2026):** sčítají se rozpočet (₩, i utracené), počet odpovědí
  `S.n`, správně/špatně u dovedností. Spojení: uzavřené spisy, suvenýry, opravy, dárky, Zpravodaj (nejlepší skóre),
  štítky Lost & found, kola kartiček. Maximum: rekord rychlého kola, poslední ranní porada. Docházka: pozdější den vyhrává.
  Naposledy změněné vyhrává po položkách: stav dovednosti (série, slabé místo, vrácení k opakování), plán opakování `rv`,
  krabička každé kartičky, každá karta Mnemo Hooks `mh.c`, rozehraný spis, rozbalená kapitola.
  **Jen v zařízení:** rychlost hlasu (`localStorage['gamgol-voice-rate']`, od 2.9), světlý/tmavý vzhled, klávesnice na obrazovce, psaní vs. dlaždice, pořadí slov v Lost & found.
- **Nové pole v `S`** = rozhodni pravidlo a doplň ho do `syCount`/`sySetCount`, `sySets`/`syUnion` nebo
  `syItems`/`syNorm`/`syPut`. Stav a `localStorage['gamgol-sync']` se ukládají vždy spolu (`syPersist`).
  Formát ve schránce má `v:1`; při nekompatibilní změně ho zvyš.
- „Erase all progress“ a načtení přenosového kódu se zapnutou synchronizací ji v tom zařízení vypnou (jinak by se smazání
  odečetlo / kód přepsal všechna zařízení). Při znovuzapnutí se zařízení zeptá „Převzít / Přičíst“.
- Testy: `python3 web/tools/test_sync.py` (napodobený GitHub, 4 zařízení), `python3 web/tools/test_qr.py` (falešná
  kamera, potřebuje ffmpeg), obě proti `index.html`. Nikdy netestuj proti skutečnému GitHubu.

## Testy hry
`sh web/build.sh && for t in t1 t2 t3 tc; do python3 web/tools/$t.py; done` (Playwright).

## Pravidla obsahu (dodržovat při úpravách)

- Podklad: učebnice **세종한국어 회화 3**, 14 kapitol. Skeny učebnice v balíčku **nejsou**. Pro nový obsah je přilož do konverzace.
- Hra je **v korejštině a angličtině**. Žádná čeština a **žádná romanizace**. Výjimka: sekce Mnemo Hooks je česky, zdroj jsou balíčky z projektu Mnemo Korean, data se generují `web/tools/mnemo_build.py`. Česká výslovnost latinkou (pole `vyslovnost`, „čorŏp“) se v kartě ukáže **až po ťuknutí** (uživatel, 27. 11. 2026); revidovaná romanizace nikde. Hook = `mnemo_zvuk` (hook podle zvuku); `mnemo` + kořeny jsou sbalené pod „Hook přes hanja“, bez `mnemo_zvuk` rozbalené. Odpověď napsaná latinkou se odmítá.
- Všechno korejské patří do obsahových souborů. `engine.js` obsahuje jen logiku.
- Zdvořilost je pevně daná postavou (`CAST` v `content.js`): 소장님 합쇼체, 선배 a občané 해요체, 동기 a 하람 반말, starší lidé 해요체 + -(으)시-. Sám sebe nikdy neuctívej.
- Nová postava potřebuje v `CAST` i `g: "m"`, pokud je to muž. Hlas se podle toho vybere sám.
- Otázka s anglickými možnostmi (`enOpts`) zamyká překlad replik ve scéně až do odpovědi (engine, `lineHtml(l, lock)`). V obsahu se o to starat nemusíš.
- Vzorce odpovědí: `"(a|b|)"` se rozvine do všech variant (prázdná = vynecháno).
- `grp` u slovíček: blízká synonyma se nikdy nesmí objevit jako vzájemné špatné možnosti.
- Časování sloves je předgenerované a zkontrolované ručně. Nikdy ho neodhaduj podle pravopisu.
- Jazykový obsah prošel korekturou, ale ne rodilým mluvčím.
- Po každé změně obsahu spusť `audio_list.py` a `record.py`, aby nové věty dostaly zvuk.
- **Card index** (kartičky `startCards`) je od 2.7 **skrytý** (uživatel, 17. 11. 2026): kartičky jsou jen Mnemo Hooks. Kód i uložený postup `S.cards` zůstaly (synchronizují se dál), nevracet bez dohody.
- Karta „Continue“ na úvodní obrazovce je **záměrně vyřazená** (uživatel, 23. 10. 2026). Kód `cont` v `home()` a styly `.contcard` zůstaly, nevracet ji.

---


## Zvuk
Podrobnosti (hlasy, nahrávání, balíky, historie verzí) v `TECHNIKA.md`. Hlasy Supertonic 3 F1/M1, rychlost 0.92
(Mnemo Hooks 0.85), zvolené uživatelem; neměnit.
Od 2.9 si uživatel volí rychlost přehrávání v patičce úvodní obrazovky (1 / 0.9 / 0.8 / 0.7, `VRATE` v `engine.js`, platí
pro všechny nahrávky i hlas telefonu přes `AndroidApp.rate`); tamtéž je verze aplikace (`appVer`, web: `GG_WEB_VER` z `android/verze.txt`). `python3 web/tools/record.py` nahraje jen chybějící věty.
