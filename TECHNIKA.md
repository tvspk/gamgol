# Gamgol: zvuk a historie verzí (technické poznámky)

> Převzato z předávacího balíčku (HANDOFF.md) bez odkazů na účty a artefakty. Platná pravidla projektu jsou v `CLAUDE.md`.

Stav k 12. 10. 2026: **nahraná je celá hra**: 2 054 nahrávek ve 29 balících (32,6 MB). Hra (verze 2 artefaktu) i APK 1.6 (versionCode 7) zvuk mají. Čeká se na poslech a nahlášení špatných nahrávek.
Kontrola délek označila 61 nahrávek. Všechny jsou samostatná jedno- a dvouslabičná slova z kartiček, která jsou na slabiku přirozeně delší. Nejde o vady. Žádná nahrávka není podezřele krátká.

Ostatní pravidla projektu (obsah, podpisový klíč, sestavení) jsou v `PREDANI.md`.

## Hlas
- **Supertonic 3** (Supertone Inc.), ONNX přes onnxruntime, Python balíček `supertonic` (pip, verze 1.3.1).
- Složka modelu: `/home/claude/tts/model` (`onnx/` + `voice_styles/` + `LICENSE`). Jiné umístění nastavíš proměnnou `GAMGOL_TTS_MODEL`.
- Otisky SHA-256 onnx: duration_predictor `c3eb9141…`, text_encoder `c7befd5e…`, vector_estimator `883ac868…`, vocoder `085de76d…`.
- **Hlasy: F1** (hráč/김 순경, vyprávěcí role, správné odpovědi, ženy: 선배, 서진, 복순, 미숙) a **M1** (muži: 소장님, 도윤, 하람, 이장님, 덕배). Vybral je uživatel z ukázky všech deseti hlasů.
- Pohlaví postav je v `CAST` v `content.js` jako `g: "m"`. Bez `g` se použije F1.
- Rychlost `speed=0.92` (uživatel: „rychlost je ok“), `total_steps=8`, `lang="ko"` vždy napevno. Korejštinu tak model nemůže splést s angličtinou, na rozdíl od velšského Piperu.
- Licence OpenRAIL-M: v patičce úvodní obrazovky je poděkování a upozornění, že zvuk je strojově generovaný. Licence to vyžaduje (příloha A, bod e). Ukazuje se jen tehdy, když je rejstřík nahrávek neprázdný.
- Model nemá slovník výslovnosti, čte rovnou hangul. Změny výslovnosti (연음, 비음화, 경음화) ověřuje uživatel poslechem.

## Co se nahrává
Vyprávění je v této hře **anglicky**, takže se nenahrává. Nahrává se jen korejština:
- `line`: repliky postav ve scénách (hlas podle postavy `l.c`),
- `task`: věta úkolu `q.ko` ve scénách a v analýze stop. Věta s mezerou `___` se nahrává s doplněnou první přijatou odpovědí (`canonOf` + `fillOf`), tak jak se ukáže po odpovědi. Hlas podle `q.from` (bez `from` = hráč = F1).
- `read`: Zpravodaj, každá věta zvlášť; tlačítko v záhlaví sloupku je přehraje za sebou. Hlas F1, v chatovém sloupku podle jména mluvčího.
- `card`: slovíčka a fráze z kartiček (jen základní tvar), F1.
- `cardex`: příklad ke kartičce, F1.

Náhodně generované otázky (telefonní služba, noční směna, opakování) se nenahrávají. U nich zůstává hlas zařízení, pokud nějaký korejský má.

## Jak to funguje
- `engine.js`, oddíl „Recorded voice“: `audioKey(v, t) = FNV-1a(v + "|" + sayText(t))` (8 hex znaků), kde `sayText` odstraní `{tvar|lemma}` a sjednotí mezery.
- `audioList()` vytváří seznam k nahrání ze stejných funkcí (`voiceOf`, `qVoice`, `readVoice`, `canonOf`, `fillOf`), jaké používají tlačítka. Názvy tak vždycky sedí.
- `web/src/audio_index.js` obsahuje `const GG_AUDIO = {klíč: [balík, posun, délka]}`, generuje ho `record.py`, a `build.sh` ho přidá za `content16.js`.
- **Artefakt:** balíky `audio/u<N>.mp3` (repliky, úkoly a Zpravodaj kapitoly N; `uf` = závěrečný spis) a `audio/k<N>.mp3` (kartičky). Balík se stáhne až při prvním přehrání, nahrávka se z něj vyřízne jako Blob. Kartičkový balík se tedy stáhne, jen když si kartičku pustíš.
- **APK:** `build_apk_html.py` vloží `var GG_AUDIO_LOOSE=1` a zkopíruje `audio/mp3/<klíč>.mp3` do `assets/a/`. Hra pak hraje `a/<klíč>.mp3`.
- Tlačítko `.tts.rec` je vidět, jen když nahrávka existuje. Bez nahrávky se ukáže jen při korejském hlasu zařízení (`body.tts-ok`). Druhé ťuknutí přehrávání zastaví. Při změně obrazovky (`setMain`) se zvuk zastaví.

## Postup
```sh
sh web/build.sh                              # test.html potřebuje audio_list.py
python3 web/tools/audio_list.py              # -> audio/list.json (2054 nahrávek, 40 339 znaků)
python3 web/tools/record.py                  # nahraje CHYBĚJÍCÍ, existující nikdy nepřepíše; balíky + rejstřík + audio/check.tsv
python3 web/tools/record.py --only u2,k2     # jen vybrané balíky
python3 web/tools/record.py --takes KLÍČ ..  # 3 pokusy do audio/takes/KLÍČ-1..3.mp3
python3 web/tools/record.py --pick KLÍČ N    # vybraný pokus přepíše audio/mp3/KLÍČ.mp3 a přegeneruje balíky
sh web/build.sh                              # znovu, s novým rejstříkem
python3 web/tools/listen_page.py             # poslechová stránka audio/listen/
python3 web/tools/unbundle.py                # obnoví audio/mp3/ z balíků (ZIP se zvuky by byl moc velký)
```
- MP3: mono, 44,1 kHz, 48 kbit/s, ořezané ticho na začátku i na konci, pak 0,15 s ticha na konci. Bez ID3.
- Rychlost nahrávání: kapitola za 4 minuty na 2 jádrech. Velikost: kolem 2,5 MB na kapitolu (u + k), celá hra asi 35 MB.
- Kontrola délek (`check.tsv`) hlásí nahrávky mimo rozsah 0,6–1,7× mediánu sekund na slabiku a krátká slova delší než 2,5 s. Špatnou výslovnost tím neodhalíš.

## Artefakty
Odkazy na artefakty na claude.ai jsou jen v soukromém předávacím balíčku (PREDANI.md).

## Ručně vybrané nahrávky
(zatím žádné)

## Rozhodnutí
- Náhled HTML souboru v chatu přehrávání neumí (data: audio nehrálo), proto ukázky publikujeme jako artefakty s MP3 jako samostatnými soubory.
- APK nad 30 MB rozdělit na části (`cmd /c copy /b x.apk.part00+x.apk.part01 x.apk`) a přiložit začátek SHA-256. Další versionCode = 7.

## Vydání

- Předávací balíček v2 (12. 10. 2026): gamgol-predani-v2.zip + gamgol-audio-1/2.zip (u* a k* balíky) + původní toolchain zipy. Návod v PREDANI.md.

## Oprava 12. 10. 2026 večer: přehrávání za sebou (APK 1.7, versionCode 8, artefakt hry verze 3)
- Problém: Zpravodaj v kap. 8 přehrál jen první větu (u uživatele, nejspíš Safari/iOS nebo WebView). Každá věta měla vlastní `new Audio()` a tyto prohlížeče dovolí přehrávání jen prvku spuštěnému ťuknutím.
- Oprava: jeden sdílený `<audio>` (`player()` v engine.js), který `unlockAudio()` odemkne při ťuknutí přehráním krátkého ticha (`SILENT`). Stejná oprava je v poslechové stránce. V APK je navíc `setMediaPlaybackRequiresUserGesture(false)`.
- Ověřeno v Chromiu s `--autoplay-policy=user-gesture-required` v iframe z jiné domény: přehraje všech 6 vět. Na skutečném iPhonu nebo Androidu to neověřoval Claude, ale uživatel.
- APK 1.7: SHA-256 f10cfa9b56d08246f8c19d65c9e6224004b1b95d396c773eb0a64a216643f65e, podpis 5013f733…

## Úprava 13. 10. 2026: překlad u otázek s anglickými možnostmi (APK 1.8, versionCode 9, artefakt hry verze 4)
- U 15 scén v kap. 6–14 šlo přeložit repliku před odpovědí, a tím prozradit odpověď. Engine teď u každé otázky s `enOpts` zamkne „Show translation“ (text „Translation appears once you have answered.“) a po odpovědi ho odemkne. Uživatel zvolil odemknutí, protože `q.en` dole ukazuje jen klíčovou větu, ne celou repliku.
- Ověřeno na 06-A s5 (zamčeno, klik nic nedělá, po odpovědi odemčeno a ukáže celý překlad) a na 01-A s2 (beze změny).
- APK 1.8: SHA-256 bc1deec53ff25d3df3da3027d9fb02f30bd6399aa53f33e195413cfd94ebdb26, podpis 5013f733…

## Převzetí druhým účtem 23. 10. 2026 (cesta B, APK 1.9, versionCode 10)
- `web/gamgol.html` sestavené z balíku = `hotove/gamgol.html` bajt po bajtu.
- APK 1.9 (versionCode 10, obsah beze změny proti 1.8): 35 260 758 B, SHA-256 048ca04d6dad71546c20c0ce76738df4c969e200f8918e54ed3cbd2dd67d09f2, podpis 5013f733… = původní klíč.

## Úprava 23. 10. 2026: streak i za kartičky (APK 2.0, versionCode 11, artefakt hry verze 2)
- Každá ohodnocená kartička (Card index) se počítá jako jedna odpověď do docházky (`stampDay()` v obsluze `.rb`). Deset kartiček, deset odpovědí nebo libovolný mix rozsvítí denní lucernu. Texty docházky to zmiňují.
- Ověřeno v Playwrightu: 10 kartiček → lucerna rozsvícená, streak 1, bez chyb. `hotove/gamgol.html` aktualizováno.
- APK 2.0: SHA-256 9b48117d7a7e2fef8fb2cbda625cbdbcd91a7324f47c1b3f610c0f230dc52da0, podpis 5013f733… Další versionCode = 12.

## Kontrola a opravy 23. 10. 2026 (APK 2.1, versionCode 12, hra verze 3, poslech verze 2)
Prověřeno: všechny testy (t1, t2, t3, tc), ESLint celého skriptu, integrita obsahu (2 006 otázek: dovednosti, postavy, duplicitní možnosti, přijetí vzorové odpovědi, dlaždice, glosy Zpravodaje), 2 054 nahrávek = rejstřík, nejhorší velikost uloženého postupu asi 125 KiB (limit db 256 KiB), Android obálka, poslechová stránka.
Opraveno:
- Ukládání do účtu: dřív každá chyba kromě `unavailable` (např. `resource_exhausted` při rychlém hraní) ukládání vypnula až do obnovení stránky. Teď se opakuje s rostoucí pauzou a zastaví se jen u trvalých kódů (`SAVE_FATAL`).
- Načtení při startu: krátký výpadek čtení už nepřepne hru na kopii v zařízení (jeden pokus navíc).
- Uložení při odchodu: `pagehide` a `window.__flush`; APK ho volá v `onPause`, takže se neztratí poslední odpovědi při přepnutí aplikace.
- Přenosový kód: poškozený nebo useknutý kód hlásí srozumitelnou chybu; načtený kód projde stejnou migrací (`migrate()`) jako start.
- Streak: počítají se i odpovědi ve Zpravodaji (jako všechny ostatní odpovědi).
- Lost & found: ochrana proti neplatným indexům slov po změně obsahu.
- Poslech: rozepsaná poznámka k nahlášení se už nesmaže při přehrávání ani při změně nahlášení odjinud; přehrávání jen posouvá zvýraznění (nepřekresluje 2 054 řádků); tlačítko Přehrát vše/Zastavit ukazuje správný stav; chyba při rušení nahlášení se zobrazí.
Karta „Continue“ (`cont` v `home()`, styly `.contcard`) se sestavuje, ale nevykresluje: uživatel potvrdil, že je **záměrně vyřazená**. Nevracet.
- APK 2.1: SHA-256 c2f28f4a35397ebad2b974c8e9d21e3a1510631eabe5f42ab175cd43b9619907, podpis 5013f733… Další versionCode = 13.

- Předávací balíček v3 (23. 10. 2026): gamgol-predani-v3.zip + gamgol-audio-1/2.zip (beze změny od v2) + gamgol-toolchain-1/2.zip (beze změny) + GamgolSubstation-2.1.apk.part00/01. Návod v PREDANI.md.

## Úprava 11. 11. 2026: Mnemo Hooks a jednodušší Lost & found (APK 2.2, versionCode 13; APK 2.3, versionCode 14: gramatická hesla bez tlačítka přehrání)

- **Mnemo Hooks** (nový lístek u každé kapitoly): slovíčka z projektu Mnemo Korean s českými háčky, kořeny (hanja), příklady, SRS (Znovu/Těžké/Dobré/Snadné), rozpoznání, produkce psaním, poslech a kořeny. Jediná výjimka z pravidla „bez češtiny“: tato sekce je česky, protože háčky stojí na češtině. Romanizace se nepřenáší.
  - Logika: `web/src/mnemo.js` (build.sh ho vloží do engine.js před `window.__appBack`). Data: `web/src/mnemo_data.js`, generuje `python3 web/tools/mnemo_build.py <složka s ko-topik3-*.json a ko-koreny.json>`. Vyřazené karty vynechá, vypíše chybějící kořeny a rozbité odkazy.
  - Postup: `S.mh.c[klíč] = [den, interval, ease×100, opakování, výpadky]`, klíče `<id>:r|p|l` a `R:<kořen>`. Přenáší se přenosovým kódem.
  - Zvuk: hlasy `"F1/0.85"` (slova) a `"M1/0.85"` (příklady) = Supertonic F1/M1 rychlostí **0.85** (zvolil uživatel jen pro Mnemo Hooks; hra zůstává 0.92). Rychlost je součást id hlasu, takže klíče se s hrou nepletou. Balíky `m1 … m14`. `record.py` čte rychlost z id hlasu.
  - Bez nahrávky: v APK systémový korejský hlas telefonu (`AndroidApp.ttsKo/say/hush` v Bridge.java, `<queries>` TTS_SERVICE v manifestu), v prohlížeči speechSynthesis; když není nic, poslech se skryje.
- **Lost & found**: jen výběr z možností, psaní (typ "w") odstraněno. Zlatá = správně ve všech typech otázek slova a pak ještě dvakrát (`t.n`); dřívější zlatá za psaní (`t.w`) zůstává.
- Model Supertonic 3 jde z cloudového prostředí stáhnout přímo: `curl -L https://huggingface.co/Supertone/supertonic-3/resolve/main/<soubor>` (ověřeno 11. 11. 2026).

- APK 2.4 (versionCode 15), 11. 11. 2026: z Mnemo Hooks vyřazeno cvičení základních částic (을/를, 이/가, 은/는, 과/와, 으로/로): na této úrovni zbytečně jednoduché (uživatel). Nevracet. Kód `mnParticle` zůstal, nikde se nevolá.
- APK 2.5 (versionCode 16), 15. 11. 2026: **Mnemo Hooks · všechna slovíčka** (podle Gorsafu): lístek na nástěnce za závěrečným spisem, `startMnemo(null)`. Všech 1 047 karet na jedné stránce: hledání (korejsky/česky/anglicky), filtry kapitola/téma/druh, řazení podle kapitol nebo 가나다, procvičování napříč kapitolami, kořeny všech kapitol. Postup je společný s kapitolami (stejné klíče S.mh). Seznam ukazuje nejvýš 300 položek, tělo karty se vykreslí až po rozkliknutí.

## Synchronizace a GitHub (17. 11. 2026, APK 2.6, versionCode 17)
- Projekt je v repozitáři `tvspk/gamgol`; APK staví a vydává GitHub Actions (klíč v Secrets), web běží na GitHub Pages.
- Synchronizace přes soukromou schránku `tvspk/gamgol-sync` (pravidla v `CLAUDE.md` a v `web/src/sync.js`).
- Ověřeno uživatelem na skutečných zařízeních (telefon, tablet, web): párování kódem i QR, přenos postupu. Další versionCode = 18.
- APK 2.7 (versionCode 18): Card index skrytý, kartičky jen Mnemo Hooks; docházka počítá odpovědi a karty Mnemo Hooks; v záhlaví kapitoly ukazatel „Mnemo Hooks: known“ místo „Cards closed“. Další versionCode = 19.
- APK 2.8 (versionCode 19), 17. 11. 2026: **doplňkové karty Mnemo Hooks**: 288 slovíček a spojení hry, která v balíčcích Mnemo Korean chyběla (`mnemo/doplnky/chNN.tsv` → `web/tools/mnemo_doplnky.py`), s nahrávkami (569 nových v balících m1–m14, Supertonic 3 F1/M1 0.85, otisky onnx ověřené). Celkem 4 716 nahrávek ve 43 balících. Další versionCode = 20.
