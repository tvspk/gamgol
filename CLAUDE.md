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
  **Jen v zařízení:** světlý/tmavý vzhled, klávesnice na obrazovce, psaní vs. dlaždice, pořadí slov v Lost & found.
- **Nové pole v `S`** = rozhodni pravidlo a doplň ho do `syCount`/`sySetCount`, `sySets`/`syUnion` nebo
  `syItems`/`syNorm`/`syPut`. Stav a `localStorage['gamgol-sync']` se ukládají vždy spolu (`syPersist`).
  Formát ve schránce má `v:1`; při nekompatibilní změně ho zvyš.
- „Erase all progress“ a načtení přenosového kódu se zapnutou synchronizací ji v tom zařízení vypnou (jinak by se smazání
  odečetlo / kód přepsal všechna zařízení). Při znovuzapnutí se zařízení zeptá „Převzít / Přičíst“.
- Testy: `python3 web/tools/test_sync.py` (napodobený GitHub, 4 zařízení), `python3 web/tools/test_qr.py` (falešná
  kamera, potřebuje ffmpeg), obě proti `index.html`. Nikdy netestuj proti skutečnému GitHubu.

## ROZPRACOVÁNO: doplňkové karty Mnemo Hooks (od 17. 11. 2026)
Uživatel chce do Mnemo Hooks doplnit **všech 288** slovíček a spojení hry (dřív Card index / Lost & found), která v balíčcích
Mnemo Korean chybějí. Seznam je v `mnemo/doplnky/chNN.tsv` (slovo, en a věta ze hry jsou vyplněné). Práce je rozdělená do chatů:
1. kapitoly 1–2 · 2. kapitoly 3–6 · 3. kapitoly 7–11 · 4. kapitoly 12–14 · 5. zvuk, kontrola a vydání APK.
V chatu 1–4: vyplň v TSV sloupce `cs, druh, typ, tema, priklad_cs, mnemo, koreny` (popis v hlavičce
`web/tools/mnemo_doplnky.py`), pořadí řádků neměň (id karet). Pak `python3 web/tools/mnemo_doplnky.py && python3 web/tools/mnemo_build.py
&& sh web/build.sh && python3 -I web/tools/build_site.py`, testy t1 a tc, commit + push (verzi APK nezvyšuj; web se tím
aktualizuje, nové karty jsou do nahrání zvuku bez nahrávky, hraje je hlas zařízení).
Pravidla karet: česky, bez romanizace; český překlad věty ze hry (jména: 서진 Sodžin, 도윤 Tojun, 하람 Haram, 지수 선배 Čisu,
선배 kolegyně, 소장님 velitel, 이장님 starosta, 덕배 할아버지 děda Tokpe, 복순 할머니 babička Poksun, 까망이 Kkamangi,
장미숙 사장님 paní Čang (majitelka), 김 순경 strážnice Kim, 감골 Gamgol); háček krátký jako v balíčcích
(sino slova rozklad hanja, spojení = složky, původní slova zvuková asociace); témata podle balíčků té kapitoly; vše `overit: true`.
Chat 5: `python3 web/tools/audio_list.py && python3 web/tools/record.py --only m1,…,m14` (model Supertonic 3, balíček `supertonic` 1.3.1; před nahráváním porovnej otisky SHA-256 souborů onnx s TECHNIKA.md, aby hlas zněl stejně jako dosavadní nahrávky),
`sh web/build.sh`, build_site, všechny testy, `android/verze.txt` → `19 2.8`, push, ověřit vydání. Pak tento oddíl smazat.

## Testy hry
`sh web/build.sh && for t in t1 t2 t3 tc; do python3 web/tools/$t.py; done` (Playwright).

## Pravidla obsahu (dodržovat při úpravách)

- Podklad: učebnice **세종한국어 회화 3**, 14 kapitol. Skeny učebnice v balíčku **nejsou**. Pro nový obsah je přilož do konverzace.
- Hra je **v korejštině a angličtině**. Žádná čeština a **žádná romanizace**. Výjimka: sekce Mnemo Hooks je česky (bez romanizace), zdroj jsou balíčky z projektu Mnemo Korean, data se generují `web/tools/mnemo_build.py`. Odpověď napsaná latinkou se odmítá.
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
(Mnemo Hooks 0.85), zvolené uživatelem; neměnit. `python3 web/tools/record.py` nahraje jen chybějící věty.
