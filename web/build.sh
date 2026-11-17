#!/bin/sh
# Sestaví gamgol.html (stránka pro artefakt) a test.html (pro místní testy) ze src/.
set -e
cd "$(dirname "$0")"
S=src
{ echo '<title>Gamgol Substation</title>'
  echo '<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Courier+Prime:wght@400;700&family=Gaegu&family=IBM+Plex+Sans:wght@400;500;600&family=Noto+Sans+KR:wght@400;500;700&family=Special+Elite&display=swap">'
  echo '<style>'; cat $S/style.css; echo '</style>'
  echo '<div id="glow"></div><header id="hdr"></header><main id="main"></main><div id="osk" hidden></div>'
  echo '<script>'
  for i in 1 2 3 4 5 6 7 8 9 10 11 12 13 14; do cat $S/verbs_ch$i.js; done
  cat $S/content2.js $S/content.js
  for i in 3 4 5 6 7 8 9 10 11 12 13 14 15; do cat $S/content$i.js; done
  for i in 2 3 4 5 6 7 8 9 10 11 12 13 14; do cat $S/cards_ch$i.js; done
  for i in 1 2 3 4 5 6 7 8 9 10 11 12 13 14; do cat $S/reads_ch$i.js; done
  cat $S/content16.js
  cat $S/audio_index.js
  [ -f $S/mnemo_data.js ] && cat $S/mnemo_data.js
  echo '</script>'
  echo '<script>'; cat $S/qr.js; echo '</script>'
  # mnemo.js goes in before window.__appBack, sync.js before the start of the game (both inside the engine's function scope)
  echo '<script>'; awk -v f=$S/mnemo.js -v g=$S/sync.js '/^window.__appBack/{while((getline l < f)>0) print l} /^\/\* -+ Start -+ \*\/$/{while((getline l < g)>0) print l} {print}' $S/engine.js; echo '</script>'; } > gamgol.html
{ echo '<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover"><style>body{margin:0}[hidden]{display:none!important}</style></head><body>'; cat gamgol.html; echo '</body></html>'; } > test.html
wc -c gamgol.html
