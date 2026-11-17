/* =====================================================================
   GAME LOGIC — no Korean sentences below this line (only jamo tables).
   ===================================================================== */
(function () {
"use strict";
const $ = (s, r) => (r || document).querySelector(s);
const $$ = (s, r) => [...(r || document).querySelectorAll(s)];
const esc = s => String(s).replace(/[&<>"]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
const rnd = n => Math.floor(Math.random() * n);
const pick = a => a[rnd(a.length)];
const shuffle = a => { a = a.slice(); for (let i = a.length - 1; i > 0; i--) { const j = rnd(i + 1); [a[i], a[j]] = [a[j], a[i]]; } return a; };
const won = n => "₩" + Math.round(n).toLocaleString("en-US");
const C = CONTENT;
const allCh = () => C.finale ? C.chapters.concat([C.finale]) : C.chapters;      // the chapters plus the final file
const chById = id => allCh().find(c => c.id === id);

/* ---------------- Hangul helpers ---------------- */
const CHO = "ㄱㄲㄴㄷㄸㄹㅁㅂㅃㅅㅆㅇㅈㅉㅊㅋㅌㅍㅎ", JUNG = "ㅏㅐㅑㅒㅓㅔㅕㅖㅗㅘㅙㅚㅛㅜㅝㅞㅟㅠㅡㅢㅣ";
const JONG = ["", "ㄱ", "ㄲ", "ㄳ", "ㄴ", "ㄵ", "ㄶ", "ㄷ", "ㄹ", "ㄺ", "ㄻ", "ㄼ", "ㄽ", "ㄾ", "ㄿ", "ㅀ", "ㅁ", "ㅂ", "ㅄ", "ㅅ", "ㅆ", "ㅇ", "ㅈ", "ㅊ", "ㅋ", "ㅌ", "ㅍ", "ㅎ"];
const VV = { "ㅗㅏ": "ㅘ", "ㅗㅐ": "ㅙ", "ㅗㅣ": "ㅚ", "ㅜㅓ": "ㅝ", "ㅜㅔ": "ㅞ", "ㅜㅣ": "ㅟ", "ㅡㅣ": "ㅢ" };
const TT = { "ㄱㅅ": "ㄳ", "ㄴㅈ": "ㄵ", "ㄴㅎ": "ㄶ", "ㄹㄱ": "ㄺ", "ㄹㅁ": "ㄻ", "ㄹㅂ": "ㄼ", "ㄹㅅ": "ㄽ", "ㄹㅌ": "ㄾ", "ㄹㅍ": "ㄿ", "ㄹㅎ": "ㅀ", "ㅂㅅ": "ㅄ" };
const inv = o => Object.fromEntries(Object.entries(o).map(([k, v]) => [v, k]));
const VVi = inv(VV), TTi = inv(TT);
const isSyl = ch => ch >= "가" && ch <= "힣";
function splitSyl(ch) { // -> {L, V:[..], T:[..]} in single keystroke jamo
  const n = ch.charCodeAt(0) - 0xAC00, l = CHO[Math.floor(n / 588)], v = JUNG[Math.floor(n % 588 / 28)], t = JONG[n % 28];
  return { L: l, V: VVi[v] ? [...VVi[v]] : [v], T: t ? (TTi[t] ? [...TTi[t]] : [t]) : [] };
}
function joinSyl(c) {
  const v = c.V.length === 2 ? VV[c.V.join("")] : c.V[0];
  if (!c.L) return v || "";
  if (!v) return c.L;
  const t = c.T.length === 2 ? TT[c.T.join("")] : (c.T[0] || "");
  return String.fromCharCode(0xAC00 + CHO.indexOf(c.L) * 588 + JUNG.indexOf(v) * 28 + JONG.indexOf(t));
}
function toJamo(s) { let o = []; for (const ch of s) { if (isSyl(ch)) { const p = splitSyl(ch); o.push(p.L, ...p.V, ...p.T); } else o.push(ch); } return o; }
function lev(a, b) { const m = a.length, n = b.length; if (Math.abs(m - n) > 2) return 9; let p = Array.from({ length: n + 1 }, (_, i) => i);
  for (let i = 1; i <= m; i++) { const q = [i]; for (let j = 1; j <= n; j++) q[j] = Math.min(p[j] + 1, q[j - 1] + 1, p[j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1)); p = q; } return p[n]; }
const PUNCT = /[\s.,!?~"'“”‘’…·:;()]/g;
const norm = s => String(s).normalize("NFC").replace(PUNCT, "");
const spaced = s => String(s).normalize("NFC").replace(/[.,!?~"'“”‘’…·:;()]/g, "").trim().replace(/\s+/g, " ");
function expand(p) { // "(a|b|)x" -> every combination
  const m = p.match(/\(([^()]*)\)/); if (!m) return [p];
  return m[1].split("|").flatMap(alt => expand(p.slice(0, m.index) + alt + p.slice(m.index + m[0].length)));
}
const expandAll = list => (list || []).flatMap(expand);

/* Word order by rule. A sentence is cut into units (a word with its particle, a noun with the bare word
   before it, a verb with its auxiliary). Units may move freely inside their own clause; each clause still
   ends in its verb, clauses keep their order, and the sentence topic may stand anywhere before the end. */
const W_PART = /(께서는|께서|께|마다|에서는|에서|에게|한테|으로|부터|까지|하고|은|는|이|가|을|를|에|도|로|만|의)$/;
const W_BARE = new Set(["마을", "요가", "태권도", "까망이"]);                     // nouns that only look as if they end in a particle
const W_FREE = new Set(["요즘", "항상", "지금", "한번", "아직", "매일", "보통", "원래", "같이", "다시", "그런데", "이제"]);
const W_LEAD = new Set(["아니요", "아닙니다", "네", "그럼", "아니", "응", "야"]);
const W_HEAD = /(면서|나면|는데|고|서|면|니까)$/, W_NOHEAD = new Set(["독서", "라면", "프리랜서", "그리고", "서서"]);
const W_DET = new Set(["이", "네", "내", "새", "다른"]);                    // 이 옷, 네 펜: they stay in front of their noun
const W_NA = new Set(["나면", "나서"]);                                   // 먹고 나면, 먹고 나서
function wordUnits(text) {
  const raw = String(text).normalize("NFC").trim().split(/\s+/), T = raw.map(t => t.replace(/[.,!?~]/g, "")).filter(Boolean);
  let lead = 0; while (lead < T.length - 1 && ((lead === 0 && W_LEAD.has(T[lead])) || /[,.]$/.test(raw[lead]))) lead++;
  for (let j = 1; j < 3 && j < raw.length - 1; j++) if (/,$/.test(raw[j]) && lead <= j) lead = j + 1;       // 서진 씨, …
  let n = T.length, start = n - 1; const last = T[n - 1], prev = T[n - 2] || "";
  if (prev === "줄" || prev === "수") start -= 2;
  else if (/까$/.test(prev) && /^(해|합|하)/.test(last)) start -= 1;
  else if (/고$/.test(prev) && /^(있|계)/.test(last)) start -= 1;
  else if (/^(거|겁)/.test(last)) start -= 1;
  else if (/도$/.test(prev) && /^(돼|되|됩|될)/.test(last)) start -= 1;                                   // 봐도 돼요
  else if (prev === "안" && /^(돼|되|됩|될)/.test(last)) start -= 1;
  else if (/기는$/.test(prev) && /^(하|해|했|합|한)/.test(last)) start -= 1;
  else if (prev === "게" && /^(어때|어떠|어떻)/.test(last)) start -= 2;
  else if (/^(뻔|편이|편입)/.test(last)) start -= 1;                                                                // 넘어질 뻔했어요                                  // 가는 게 어때요                              // 바쁘기는 해요                                      // 떼면 안 돼요
  else if (/^(봐라|봐|보자|보세요|봐요|줘라|줘|주세요|주실래요|줄래요)$/.test(last)) start -= 1;      // 가 봐라, 열어 주세요
  for (let k = n - 2; k >= Math.max(lead + 1, n - 5); k--) if (T[k] === "적이" || T[k] === "적") { start = Math.min(start, k - 1 - (/^(본|보신)$/.test(T[k - 1]) && k - 2 >= lead ? 1 : 0)); break; }   // 가 본 적이 (한 번도) 없어요
  start = Math.max(start, lead);
  const lji = t => t.length > 1 && t.endsWith("지") && isSyl(t[t.length - 2]) && (t.charCodeAt(t.length - 2) - 0xAC00) % 28 === 8;   // 먹을지, 갈지
  const isHead = t => lji(t) || (t.length > 2 && /다가$/.test(t) && !/에다가$/.test(t)) || /^(때마다|테니까|테니)$/.test(t) || /^뻔했(지만|는데)$/.test(t) || W_HEAD.test(t) && !W_NOHEAD.has(t) && !/(에서|께서|하고)$/.test(t);
  const units = [], bare = t => /에다가?$/.test(t) || W_DET.has(t) || (W_BARE.has(t) || !W_PART.test(t)) && !W_FREE.has(t) && !isHead(t);   // A에다가 stays in front of its B
  let cur = [], clause = 0;
  for (let i = lead; i < start; i++) {
    const t = T[i];
    if (W_NA.has(t) && units.length && !cur.length) { const u = units[units.length - 1]; u.t.push(t); u.head = true; clause = u.c + 1; continue; }
    if (t === "그런지" && units.length && !cur.length) { units[units.length - 1].t.push(t); continue; }      // -아서 그런지 is one piece
    cur.push(t);
    if (/^(적이|적|본|보신)$/.test(T[i + 1] || "") || t === "적이" || t === "적") continue;                      // 간 적이 있어서
    if (/기는$/.test(t) && /^(하|해|했|한)/.test(T[i + 1] || "")) continue;                               // 어렵기는 하지만 is one piece
    if (/도$/.test(t) && /^(돼|되|됩|될)/.test(T[i + 1] || "")) continue;                                // 먹어도 될지
    if (/^뻔/.test(T[i + 1] || "") || /^(때마다|테니까|테니|정도로|정도예요|정도였어요|정도였어|정도야|정도입니다)$/.test(T[i + 1] || "")) continue;                                    // 놓칠 뻔했지만, 갈 때마다
    if (t === "가" && /^(볼|본|보는|봐|보)/.test(T[i + 1] || "")) continue;                               // 가 볼 테니까
    const afterGi = cur.length > 1 && /기는$/.test(cur[cur.length - 2]);
    if (!afterGi && bare(t) && !W_NA.has(T[i + 1])) continue;      // binds to the next word
    const adHead = /도$/.test(t) && cur.length > 1 && cur.some(x => x === "아무리" || x === "안" || x === "또");   // 아무리 바빠도, 안 와도: an -아도 clause
    const head = isHead(t) || W_NA.has(T[i + 1]) || afterGi || adHead;
    units.push({ t: cur, c: clause, head: !!head }); cur = []; if (head && !W_NA.has(T[i + 1])) clause++;
  }
  const tail = T.slice(start); if (cur.length) tail.unshift(...cur);      // a bare word right before the verb stays with it (뭐 했어)
  const first = units[0]; if (first && !first.head && first.c === 0 && /(은|는|도)$/.test(first.t[first.t.length - 1])) first.float = true;
  return { lead: T.slice(0, lead), units, tail };
}
function reorderOK(model, answer) {
  const A = String(answer).normalize("NFC").replace(/[.,!?~]/g, "").trim().split(/\s+/), M = wordUnits(model);
  const all = [...M.lead, ...M.units.flatMap(u => u.t), ...M.tail];
  if (A.length !== all.length || A.slice().sort().join(" ") !== all.slice().sort().join(" ")) return false;
  if (M.lead.join(" ") !== A.slice(0, M.lead.length).join(" ") || M.tail.join(" ") !== A.slice(A.length - M.tail.length).join(" ")) return false;
  const mid = A.slice(M.lead.length, A.length - M.tail.length), pos = new Array(M.units.length).fill(-1);
  for (let p = 0, k = 0; p < mid.length; k++) {                          // read the answer as a sequence of whole units
    const i = M.units.findIndex((u, j) => pos[j] < 0 && u.t.join(" ") === mid.slice(p, p + u.t.length).join(" "));
    if (i < 0) return false; pos[i] = k; p += M.units[i].t.length;
  }
  const heads = M.units.map((u, i) => (u.head ? i : -1)).filter(i => i >= 0);
  for (let h = 1; h < heads.length; h++) if (pos[heads[h]] < pos[heads[h - 1]]) return false;
  const headOf = c => heads.find(i => M.units[i].c === c);
  return M.units.every((u, i) => {
    if (u.head) return true;
    if (u.float) return pos[i] === 0 || heads.some(h => pos[h] === pos[i] - 1);   // the topic opens the sentence or a clause
    const mine = headOf(u.c), before = u.c > 0 ? headOf(u.c - 1) : undefined;
    return (mine === undefined || pos[i] < pos[mine]) && (before === undefined || pos[i] > pos[before]);
  });
}

/* Judge a typed answer. Returns {ok, note?, msg?, canon} */
function judge(q, raw, noSpacing) {
  const user = norm(raw), canonList = expandAll(q.accept), canon = canonList[0];
  if (/[A-Za-z]/.test(raw)) return { ok: false, msg: "Hangul only. Answers in Latin letters are not accepted.", canon };
  const same = canonList.filter(v => norm(v) === user);
  if (same.length) { // right letters: only mention spacing if no accepted spelling is spaced this way
    const exact = same.find(v => spaced(v) === spaced(raw)), note = exact || noSpacing ? "" : "Spacing: the standard way to write it is “" + spaced(same[0]) + "”. No points lost.";
    return { ok: true, note, canon: exact || same[0] };
  }
  for (const s of q.soft || []) for (const v of expandAll(s.p)) if (norm(v) === user) return { ok: true, note: s.note, canon };
  for (const v of canonList) if (reorderOK(v, raw)) return { ok: true, canon: spaced(raw) };          // another natural word order
  for (const d of q.diag || []) for (const v of expandAll(d.p)) if (norm(v) === user || reorderOK(v, raw)) return { ok: false, msg: d.msg, canon };
  for (const v of canonList) for (const w of q.lenient || []) { // one jamo off inside a content word
    const nv = norm(v), i = nv.indexOf(w); if (i < 0) continue;
    const pre = nv.slice(0, i), suf = nv.slice(i + w.length);
    if (user.startsWith(pre) && user.endsWith(suf) && user.length >= pre.length + suf.length) {
      const mid = user.slice(pre.length, user.length - suf.length);
      if (mid !== w && lev(toJamo(mid), toJamo(w)) === 1) return { ok: true, note: "Typo let through: you wrote “" + mid + "”, the word is “" + w + "”.", canon: v };
    }
  }
  return { ok: false, canon };
}

/* ---------------- Saved state ---------------- */
const fresh = () => ({ resume: null, typing: false, v: 1, won: 0, repairs: {}, souvenirs: [], cases: {}, best: {}, skills: {}, reopen: [], n: 0, vocab: {}, osk: false });
let S = fresh();
let R = { screen: "load" };              // runtime only, never saved
const store = { state: "wait", ref: null, dirty: false, busy: false, timer: 0 };

function save() {
  if (store.state !== "on") return;
  store.dirty = true; clearTimeout(store.timer); store.timer = setTimeout(flush, 700);
}
/* Codes after which a write can never succeed in this page load; anything else (unavailable, a rate
   limit, an unknown code) is retried with a growing pause, so one hiccup does not stop saving for good. */
const SAVE_FATAL = ["invalid_argument", "quota_exceeded", "revoked", "not_granted", "capability_disabled", "capability_removed", "transform_error"];
async function flush() {
  if (store.busy || !store.dirty || store.state !== "on") return;
  store.busy = true; store.dirty = false;
  try { await store.ref.set(JSON.parse(JSON.stringify(S))); store.fails = 0; }
  catch (e) { if (e && SAVE_FATAL.includes(e.code)) { store.state = "off"; drawSave(); } else { store.dirty = true; store.fails = (store.fails || 0) + 1; } }
  store.busy = false;
  if (store.dirty) store.timer = setTimeout(flush, Math.min(30000, 1500 * 2 ** Math.min(5, (store.fails || 1) - 1)) + rnd(500));
}
const flushNow = () => { if (store.dirty) { clearTimeout(store.timer); flush(); } };
function migrate() {                                       // every closed file keeps its evidence, even after an id was renamed
  allCh().forEach(c => c.cases.forEach(k => { if (S.cases[k.id] && !S.souvenirs.includes(k.souvenir.id)) S.souvenirs.push(k.souvenir.id); }));
}
async function boot() {
  drawHeader(); home();
  try {
    if (!window.claude || !window.claude.use) throw 0;
    const [db, user] = await Promise.all([window.claude.use("db"), window.claude.use("user")]);
    const id = db && user ? await user.id() : null;
    if (!id) throw 0;
    store.ref = db.doc("data/users/" + id + "/gamgol");
    let snap;                                              // a passing hiccup must not send the account's progress to the device copy
    try { snap = await store.ref.get(); } catch (e) { if (e && SAVE_FATAL.includes(e.code)) throw e; await new Promise(r => setTimeout(r, 800 + rnd(700))); snap = await store.ref.get(); }
    if (snap.exists) S = Object.assign(fresh(), JSON.parse(JSON.stringify(snap.data()))); // work on a copy
    migrate();
    store.state = "on";
  } catch (e) {
    try {                                                  // no account storage (the phone app, or a plain browser): keep it on this device
      const K = "gamgol-save", ls = window.localStorage; ls.setItem(K + "-t", "1"); ls.removeItem(K + "-t");
      const raw = ls.getItem(K); if (raw) S = Object.assign(fresh(), JSON.parse(raw));
      migrate();
      store.ref = { set: async d => ls.setItem(K, JSON.stringify(d)) }; store.local = true; store.state = "on";
    } catch (e2) { store.state = "off"; }
  }
  document.addEventListener("visibilitychange", () => { if (document.hidden) flushNow(); });
  window.addEventListener("pagehide", flushNow);            // Safari and some WebViews close a page without a visibility change
  window.__flush = flushNow;                                // the phone app calls this when it goes to the background
  R = { screen: "home" }; drawHeader(); home();
}

/* ---------------- Header ---------------- */
/* light / dark: a per-device look; kept in the save too, so a transfer code carries it */
function themeNow() { if (S.theme) return S.theme; try { return localStorage.getItem("gamgol-theme") || "light"; } catch (e) { return "light"; } }
function applyTheme(t) {
  document.documentElement.dataset.theme = t;
  try { localStorage.setItem("gamgol-theme", t); } catch (e) {}
  try { if (window.AndroidApp && window.AndroidApp.setDark) window.AndroidApp.setDark(t === "dark"); } catch (e) {}
}
applyTheme(themeNow());
const SUN = '<svg width="18" height="18" viewBox="0 0 20 20" aria-hidden="true"><circle cx="10" cy="10" r="4" fill="currentColor"/><path d="M10 1.5v2.500M10 16v2.500M1.5 10h2.500M16 10h2.500M4 4l1.700 1.700M14.300 14.300L16 16M4 16l1.700-1.700M14.300 5.700L16 4" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg>';
const MOON = '<svg width="18" height="18" viewBox="0 0 20 20" aria-hidden="true"><path d="M15.500 13.200A7 7 0 0 1 6.800 4.500 7 7 0 1 0 15.500 13.200z" fill="currentColor"/></svg>';
function drawHeader() {
  const inRound = !["home", "load"].includes(R.screen);
  const dark = themeNow() === "dark"; applyTheme(dark ? "dark" : "light");
  $("#hdr").innerHTML = `<div class="in"><div class="sign">GAMGOL SUBSTATION<small class="ko">감골 파출소</small></div>
    <svg class="clock" viewBox="0 0 40 40" aria-hidden="true"><circle cx="20" cy="20" r="18" fill="#f3ecd8" stroke="#0f1e28" stroke-width="2.5"/><line id="hh" x1="20" y1="20" x2="20" y2="10" stroke="#20303a" stroke-width="3" stroke-linecap="round"/><line id="mh" x1="20" y1="20" x2="20" y2="6" stroke="#20303a" stroke-width="1.8" stroke-linecap="round"/><circle cx="20" cy="20" r="2" fill="#bf3626"/></svg>
    <button id="theme" type="button" aria-pressed="${dark}" aria-label="${dark ? "Switch to the light look" : "Switch to dark mode"}" title="${dark ? "Light look" : "Dark mode"}">${dark ? SUN : MOON}</button>
    <div class="won" id="won" title="Station budget">${won(S.won)}</div>
    ${inRound ? '<button id="exit" type="button" aria-label="Back to the home board"><svg width="15" height="15" viewBox="0 0 16 16" aria-hidden="true"><path d="M2 8l6-5.500 6 5.500M4 7v6.500h8V7" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>Home</button>' : ""}</div>`;
  tick();
  $("#theme").onclick = () => { S.theme = themeNow() === "dark" ? "light" : "dark"; save(); drawHeader(); };
  const ex = $("#exit");
  if (ex) ex.onclick = () => {
    if (ex.classList.contains("arm")) return leave();
    const keep = ex.innerHTML; ex.classList.add("arm"); ex.textContent = R.screen === "case" ? "Tap again: your place is kept" : "Tap again: round is dropped";
    setTimeout(() => { if (ex.isConnected) { ex.classList.remove("arm"); ex.innerHTML = keep; } }, 3000);
  };
}
function tick() { const d = new Date(), h = $("#hh"), m = $("#mh"); if (!h) return;
  h.setAttribute("transform", `rotate(${(d.getHours() % 12 + d.getMinutes() / 60) * 30} 20 20)`); m.setAttribute("transform", `rotate(${d.getMinutes() * 6} 20 20)`); }
setInterval(tick, 20000);
function stopTimers() { clearInterval(R.timer); R.timer = 0; }
function leave() { stopTimers(); oskBind(null); R = { screen: "home" }; drawHeader(); home(); }
function earn(n) {
  S.won += n; if (R.earned != null) R.earned += n;
  const w = $("#won"); if (w) { w.textContent = won(S.won); w.classList.remove("bump"); void w.offsetWidth; w.classList.add("bump"); }
  save();
}
const bonus = () => (S.repairs.lamp ? 500 : 0);
function setMain(html) { stopSay(); $("#main").innerHTML = '<div class="wrap">' + html + "</div>"; window.scrollTo(0, 0); }

/* ---------------- Skills and reopened items ---------------- */
function rec(skill, ok, reopened) {
  const k = S.skills[skill] || (S.skills[skill] = { r: 0, w: 0, s: 0, weak: false });
  S.n++;
  if (ok) { k.r++; k.s++; if (k.weak && (reopened || k.s >= 3)) { k.weak = false; S.reopen = S.reopen.filter(x => x.skill !== skill); } }
  else { k.w++; k.s = 0; k.weak = true; S.reopen = S.reopen.filter(x => x.skill !== skill); S.reopen.push({ skill, at: S.n }); }
  if (R.stats) { const part = R.stats[R.part || "Round"] || (R.stats[R.part || "Round"] = {}), t = part[skill] || (part[skill] = { r: 0, w: 0 }); ok ? t.r++ : t.w++; }
  schedule(skill, ok);
  stampDay();
  save();
}
const GAPS = [1, 2, 4, 7, 14, 30, 60];                  // days until a topic comes back, by how often you have got it right on time
function schedule(skill, ok) {
  const V = S.rv || (S.rv = {}), t = today(), k = V[skill];
  if (!ok) { V[skill] = { b: 0, d: dayAdd(t, 1) }; return; }
  if (k && dayGap(t, k.d) > 0) return;                 // not due yet: right answers early do not push it further out
  const b = Math.min((k ? k.b : 0) + 1, GAPS.length - 1); V[skill] = { b, d: dayAdd(t, GAPS[b - 1]) };
}
function briefSkills() { return [...new Set(closedChapters().flatMap(c => c.skills))]; }
function dueSkills() { const V = S.rv || {}, t = today(); return briefSkills().filter(sk => !V[sk] || dayGap(t, V[sk].d) <= 0).sort((a, b) => ((S.rv || {})[a] ? S.rv[a].d : "") < ((S.rv || {})[b] ? S.rv[b].d : "") ? -1 : 1); }
function startBrief() {
  const chs = closedChapters(); if (!chs.length) return;
  const N = 10, due = dueSkills(), extra = shuffle(briefSkills().filter(x => !due.includes(x)));
  const plan = due.slice(0, 8);
  while (plan.length < N - 2 && extra.length) plan.push(extra.shift());   // nothing much due: keep the hand in with older topics
  R = { screen: "brief", stats: {}, earned: 0, i: 0, used: new Set(), phase: 0, camUsed: false, right: 0, nDue: Math.min(due.length, 8) }; drawHeader();
  const qs = plan.map(sk => genBySkill(chs, sk, false) || genBySkill(chs, sk, true)).filter(Boolean);
  while (qs.length < N) { const c = pick(chs); qs.push(genVocab(c)); }
  shuffle(qs);
  const step = () => {
    if (R.screen !== "brief") return;
    if (R.i >= qs.length) {
      const B = S.brief || (S.brief = {}); B.day = today(); save();
      const V = S.rv || {}, t = today(), soon = briefSkills().filter(sk => V[sk] && dayGap(t, V[sk].d) === 1).length;
      setMain(`<div class="card"><p class="place">Morning briefing · 09:10</p><p class="narr">${R.right >= 9 ? "The chief nods at every answer and then, unprompted, at the goat." : R.right >= 6 ? "Most of it held overnight. The rest has been written on the board in large letters." : "A rocky start to the day. The topics you missed come back tomorrow, earlier than the others."} ${R.right} of ${qs.length} right. You earned ${won(R.earned)}.</p>${skillSummary(R.stats)}
        <p style="font-size:13px;color:var(--ink-soft);margin-top:10px">Each topic comes back after a gap that grows every time you get it right: 1 day, 2, 4, a week, two weeks, a month. A miss brings it back tomorrow. ${soon ? soon + " topic" + (soon === 1 ? " is" : "s are") + " due tomorrow." : ""}</p>
        <div class="row" style="margin-top:12px"><button class="btn alt" id="hm" type="button">Back to the board</button><button class="btn alt" id="ag" type="button">One more round</button></div></div>`);
      $("#ag").onclick = startBrief; $("#hm").onclick = leave; return; }
    setMain(`<div class="casehead"><h2>Morning briefing <span class="ko" lang="ko" style="font-size:16px">아침 조회</span></h2><span>${R.i + 1} of ${qs.length}</span></div><p class="narr" style="margin-bottom:10px">${R.i === 0 ? "09:00. The chief reads out yesterday's business, and then everything you learned last week, in case it has wandered off." : ""}</p><div id="qb"></div>`);
    R.sceneBox = null; ask(qs[R.i], $("#qb"), { pay: 600, alwaysWhy: true }, res => { if (res && res.ok) R.right++; R.i++; step(); });
  };
  step();
}
/* Attendance book: ten answers or rated index cards in a day earn that day's stamp. Days in a row make the streak; a day of
   annual leave (one earned per seven stamps, two at most) quietly covers a missed day. */
const ATT_NEED = 10, ATT_MARKS = [
  { n: 3, ko: "작심삼일", en: "“a resolution lasts three days”", pay: 3000, line: "Koreans have a four-syllable phrase for resolutions that die on day three. Yours has not. The phrase is disappointed." },
  { n: 7, ko: "일주일", en: "one week", pay: 7000, line: "A full week. The chief has started using your name, which is how it begins." },
  { n: 30, ko: "한 달", en: "one month", pay: 30000, line: "A month without a gap. The goat has a worse record, and the goat lives here." },
  { n: 100, ko: "백일", en: "the hundredth day", pay: 100000, line: "One hundred days. In Korea this is celebrated for babies and couples. Nobody planned for a constable, so there is no cake." }];
const dayKey = d => d.getFullYear() + "-" + String(d.getMonth() + 1).padStart(2, "0") + "-" + String(d.getDate()).padStart(2, "0");
const dayAdd = (key, n) => { const [y, m, d] = key.split("-").map(Number); return dayKey(new Date(y, m - 1, d + n)); };
const dayGap = (a, b) => { const f = k => { const [y, m, d] = k.split("-").map(Number); return Date.UTC(y, m - 1, d); }; return Math.round((f(b) - f(a)) / 864e5); };
const today = () => dayKey(window.__now ? new Date(window.__now) : new Date());
function att() { return S.att || (S.att = { day: "", cnt: 0, last: "", n: 0, best: 0, leave: 0, log: {}, hit: [], msg: "" }); }
function stampDay() {
  const A = att(), t = today();
  if (A.day !== t) { A.day = t; A.cnt = 0; }
  A.cnt++;
  if (A.cnt < ATT_NEED || A.last === t) return;
  const gap = A.last ? dayGap(A.last, t) : 0; A.msg = "";
  if (!A.last || gap < 1) A.n = 1;
  else if (gap === 1) A.n++;
  else if (gap - 1 <= A.leave) { A.leave -= gap - 1; for (let i = 1; i < gap; i++) A.log[dayAdd(A.last, i)] = "l"; A.n++; A.msg = "Annual leave was filed on your behalf for the day you were not here. Nobody asked you. The streak survives."; }
  else { if (A.n > 1) A.msg = "The last run ended at " + A.n + " days. The book has turned to a fresh page and is not going to mention it."; A.n = 1; }
  A.last = t; A.log[t] = "s"; A.best = Math.max(A.best, A.n);
  if (A.n % 7 === 0 && A.leave < 2) A.leave++;
  const m = ATT_MARKS.find(k => k.n === A.n && !A.hit.includes(k.n));
  if (m) { A.hit.push(m.n); S.won += m.pay; A.msg = m.line + " Bonus " + won(m.pay) + "."; drawHeader(); }
  for (const k of Object.keys(A.log)) if (dayGap(k, t) > 20) delete A.log[k];
}
function attCard() {
  const A = att(), t = today(), gap = A.last ? dayGap(A.last, t) : 0, alive = A.last && (gap <= 1 || gap - 1 <= A.leave), n = alive ? A.n : 0;
  const cnt = A.day === t ? A.cnt : 0, done = A.last === t, WD = ["일", "월", "화", "수", "목", "금", "토"];
  const days = [-6, -5, -4, -3, -2, -1, 0].map(o => { const k = dayAdd(t, o), v = A.log[k], [y, m, d] = k.split("-").map(Number);
    return `<div class="aday ${v === "s" ? "st" : v === "l" ? "lv" : ""} ${o === 0 ? "now" : ""}" title="${v === "s" ? "Lantern lit" : v === "l" ? "Annual leave" : o === 0 ? "Today, not lit yet" : "Not lit"}"><i></i><span class="ko" lang="ko">${WD[new Date(y, m - 1, d).getDay()]}</span></div>`; }).join("");
  const bar = (a, b) => `<g transform="translate(36 24) rotate(${a}) translate(22 0)">${b.map((solid, k) => solid ? `<rect x="${-4 + k * 3}" y="-6" width="2" height="12"/>` : `<rect x="${-4 + k * 3}" y="-6" width="2" height="5.5"/><rect x="${-4 + k * 3}" y=".5" width="2" height="5.5"/>`).join("")}</g>`;
  const flag = `<svg class="flag" viewBox="0 0 72 48" role="img" aria-label="Flag of South Korea"><rect width="72" height="48" fill="#fff"/><g transform="translate(36 24) rotate(33.69)"><circle r="12" fill="#0047a0"/><path d="M-12 0a12 12 0 0 1 24 0a6 6 0 0 0-12 0a6 6 0 0 1-12 0z" fill="#cd2e3a"/></g><g fill="#111">${bar(213.69, [1, 1, 1])}${bar(33.69, [0, 0, 0])}${bar(-33.69, [0, 1, 0])}${bar(146.31, [1, 0, 1])}</g></svg>`;
  const next = ATT_MARKS.find(k => k.n > n);
  const line = A.msg && done ? A.msg : done ? "Tonight\u2019s lantern is lit. The moon rabbit has stopped pounding rice cake to look, which is the closest it comes to applause." : cnt ? `${cnt} of ${ATT_NEED} answers or cards today. The lantern is not lit yet. The rabbit is pretending not to watch.` : !A.last ? `Answer ${ATT_NEED} questions or turn over ${ATT_NEED} index cards in a day and a lantern goes up for it. Right or wrong; the lantern is not a snob.` : alive ? `Nothing yet today. ${ATT_NEED} answers or cards keep the row of lanterns going. They do look better lit.` : "You were away. The book noticed, and has decided to be the bigger person about it.";
  return `<section class="attbox" aria-label="Attendance book"><div class="arow"><div class="ahead"><span class="num">${n}</span>
      <div class="ttl"><b>Attendance book ${flag}</b><span>day${n === 1 ? "" : "s"} in a row${A.best > n ? " · best " + A.best : ""}</span></div></div>
      <div class="aweek">${days}</div>
      <svg class="moon" viewBox="0 0 64 64" aria-hidden="true"><circle cx="32" cy="32" r="28" fill="#fbeeb0"/><g fill="#e3cf82"><ellipse cx="27" cy="20" rx="3" ry="9" transform="rotate(-12 27 20)"/><ellipse cx="35" cy="20" rx="3" ry="9" transform="rotate(10 35 20)"/><circle cx="31" cy="31" r="7"/><ellipse cx="29" cy="44" rx="10" ry="9"/><circle cx="20" cy="47" r="3"/><rect x="42" y="30" width="3" height="16" rx="1.5" transform="rotate(14 43 38)"/><path d="M40 46h14l-2 8H42z"/></g></svg></div>
    <p class="aline">${esc(line)}</p>
    <details class="amore"><summary>How the book works</summary><p>${ATT_NEED} answers or index cards in a day (any mix) light that day's lantern; the row shows the last seven days, today on the right. ${next ? `Next: day ${next.n}, <span class="ko" lang="ko">${next.ko}</span> (${esc(next.en)}), worth ${won(next.pay)}.` : "No milestones left. You have outlasted the stationery."} A small moon is a day of annual leave, <span class="ko" lang="ko">연차</span>: one is earned every seventh lantern and spent automatically on a missed day. In hand: ${A.leave}.</p></details></section>`;
}
const weakSkills = chs => chs.flatMap(c => c.skills).filter(s => S.skills[s] && S.skills[s].weak);
const closedChapters = () => C.chapters.filter(c => c.cases.some(k => S.cases[k.id]));
function poolItem(chs, skill, types) {
  const all = chs.flatMap(c => c.pool).filter(q => q.skill === skill && (!types || types.includes(q.type)));
  const unseen = all.filter(q => !(R.used || (R.used = new Set())).has(q));
  const q = pick(unseen.length ? unseen : all); if (q) R.used.add(q); return q || null;
}
function nextReopened(chs) {
  const have = new Set(chs.flatMap(c => c.skills));
  const e = S.reopen.find(x => have.has(x.skill) && S.n - x.at >= 2); if (!e) return null;
  const q = poolItem(chs, e.skill) || genBySkill(chs, e.skill); return q ? Object.assign({}, q, { reopened: true }) : null;
}

/* ---------------- Question generators (from tables) ---------------- */
function formWhy(v, f) {
  const key = f.key;
  if (v.why && v.why[key]) return v.why[key];                     // a note written for this one verb
  if (f.why) { // chapter supplies its own explanations: by class, else by how the stem ends
    const last = v.d.slice(-2, -1), cons = isSyl(last) && (last.charCodeAt(0) - 0xAC00) % 28 !== 0;
    return (f.why[v.cls] || f.why[cons ? "cons" : "vowel"]).replace(/\{d\}/g, v.d).replace(/\{a\}/g, v[key] + (f.tail || ""));
  }
  const isMs = key === "ms";
  if (v.cls === "ㄷ") return v.d + " is a ㄷ irregular verb: ㄷ becomes ㄹ before a vowel ending, and 으 stays: " + v[key] + ".";
  if (v.cls === "ㅅ") return v.d + " is a ㅅ irregular verb: ㅅ drops before a vowel ending, and 으 stays: " + v[key] + ".";
  if (v.cls === "ㄹ") return v.d + " has a ㄹ stem: " + (isMs ? "it takes -면서 with no 으 and keeps its ㄹ." : "it only adds -까, because the stem already ends in ㄹ.");
  const cons = v.ms.endsWith("으면서");
  let s = "The stem of " + v.d + " ends in a " + (cons ? "consonant: " + (isMs ? "-으면서" : "-을까 하다") : "vowel: " + (isMs ? "-면서" : "-ㄹ까 하다")) + ".";
  if (["받다", "얻다", "웃다"].includes(v.d)) s += " It is regular: nothing in the stem changes.";
  return s;
}
function genForm(ch, want) { // want: skill id or undefined
  let cand = [];
  for (const v of ch.verbs) for (const f of ch.forms) {
    if (!v[f.key]) continue;
    const by = { "ㄷ": "irr", "ㅅ": "irr", "ㄹ": "lst", "ㅂ": "bir", "르": "rir", "으": "eu" }[v.cls];
    const sk = !f.flat && !(f.plain || []).includes(v.cls) && by && ch.skills.includes(by) ? by : f.skill; // a "flat" form never changes the stem
    if (!want || want === sk) cand.push({ v, f, sk });
  }
  if (!cand.length) return null;
  const { v, f, sk } = pick(cand), tail = f.tail || "", wk = f.w || (f.key === "ms" ? "mw" : "lw");
  return { type: "mc", skill: sk, ask: v.d + " + " + f.label, ko: v.d + " → ___", sub: v.en, opts: [v[f.key] + tail, ...v[wk].map(x => x + tail)], why: formWhy(v, f), gen: true };
}
const isVerb = w => w.pos === "av" || w.pos === "dv";
function vocabDistract(ch, w, field) {
  const pool = ch.vocab.filter(x => x !== w && isVerb(x) === isVerb(w) && !(w.grp && x.grp === w.grp) && x[field] !== w[field]);
  const rest = ch.vocab.filter(x => x !== w && !pool.includes(x) && !(w.grp && x.grp === w.grp) && x[field] !== w[field]);   // too few of its own kind: borrow
  return [...shuffle(pool), ...shuffle(rest)].slice(0, 3).map(x => x[field]);
}
function genVocab(ch, dir, w) {
  w = w || pick(ch.vocab); dir = dir || pick(["m", "r"]);
  return dir === "m"
    ? { type: "mc", skill: ch.vocSkill || "voc", ask: "What does it mean?", ko: w.ko, opts: [w.en, ...vocabDistract(ch, w, "en")], enOpts: true, why: w.ko + " means “" + w.en + "”.", gen: true }
    : { type: "mc", skill: ch.vocSkill || "voc", ask: "Which is the Korean for: " + w.en + "?", opts: [w.ko, ...vocabDistract(ch, w, "ko")], why: "“" + w.en + "” is " + w.ko + ".", gen: true };
}
function genColloc(ch, c) {
  c = c || pick(ch.colloc);
  return c.particle
    ? { type: "mc", skill: c.skill || ch.colSkill || "col", ask: (c.why ? "Pick the ending: " : "Pick the particle: ") + c.en + ".", ko: c.stem + "___ " + c.tail, opts: [c.a, ...c.w], why: c.why || "It is " + c.stem + c.a + " " + c.tail + ". -(으)로: 으로 after a consonant, 로 after a vowel or ㄹ.", gen: true }
    : { type: "mc", skill: ch.colSkill || "col", ask: "Pick the verb: " + c.en + ".", ko: c.stem + " ___", opts: [c.a, ...c.w], why: "The set phrase is " + c.stem + " " + c.a + ".", gen: true };
}
function genBySkill(chs, skill, mcOnly) {
  const ch = pick(chs.filter(c => c.skills.includes(skill))); if (!ch) return null;
  const types = mcOnly ? ["mc"] : null, fromPool = () => poolItem([ch], skill, types);
  if ([...ch.forms.map(f => f.skill), "irr", "lst", "bir"].includes(skill)) return (Math.random() < .4 && fromPool()) || genForm(ch, skill) || fromPool();
  if (skill === (ch.vocSkill || "voc")) return (Math.random() < .25 && fromPool()) || genVocab(ch);
  if (skill === (ch.colSkill || "col")) return (Math.random() < .25 && fromPool()) || genColloc(ch);
  return fromPool();
}
function genMixed(chs, preferWeak, mcOnly) {
  const weak = weakSkills(chs), all = [...new Set(chs.flatMap(c => c.skills))];
  for (let i = 0; i < 12; i++) { const q = genBySkill(chs, preferWeak && weak.length && Math.random() < .7 ? pick(weak) : pick(all), mcOnly); if (q) return q; }
  return genVocab(chs[0]);
}
function genSpeed(ch) { const r = Math.random(); return r < .3 ? genForm(ch) : r < .4 ? (genForm(ch, pick(["irr", "lst", "bir"])) || genForm(ch)) : r < .75 ? genVocab(ch) : genColloc(ch); }

/* ---------------- Shared question renderer ---------------- */
const who = id => { const c = C.cast[id]; return `<span class="p"><b class="ko">${esc(c.name)}</b><small>${esc(id === "me" ? "you" : c.rel + " · " + c.role)}</small></span>`; };
function whoRow(q) {
  if (!q.from && !q.to) return "";
  const f = q.from || "me", t = q.to || "me", other = f === "me" ? t : f, c = C.cast[other];
  return `<div class="who">${who(f)}<span class="arrow">→</span>${who(t)}${f === "me" && c.you ? `<span>you speak: <b>${esc(c.you)}</b></span>` : ""}</div>`;
}
/* ---------------- Recorded voice ----------------
   Korean lines with a play button are recorded ahead of time (web/tools/record.py). What to record comes from
   audioList() below, which uses the same voice and text helpers as the buttons, so the names always match.
   A recording is found by key = FNV-1a(voice + "|" + text). The artifact fetches one bundle per chapter
   (audio/u1.mp3: case lines and columns, audio/k1.mp3: cards) on first play and cuts the clip out of it;
   the phone app has every clip as its own file (a/<key>.mp3). No recording: the device's Korean voice, if any. */
const VOICE_F = "F1", VOICE_M = "M1";                        // F1: you, narration, women; M1: men
const voiceOf = id => (C.cast[id] && C.cast[id].g === "m") ? VOICE_M : VOICE_F;
const qVoice = q => voiceOf(q.from || "me");
const sayText = t => String(t).replace(/\{([^|}]+)\|[^}]+\}/g, "$1").replace(/\s+/g, " ").trim();
function fnv(s) { let h = 0x811c9dc5; for (const b of new TextEncoder().encode(s)) { h ^= b; h = Math.imul(h, 0x01000193) >>> 0; } return h.toString(16).padStart(8, "0"); }
const audioKey = (v, t) => fnv(v + "|" + sayText(t));
const AUD = typeof GG_AUDIO !== "undefined" ? GG_AUDIO : {};   // {key: [bundle, offset, length]}
const hasRec = (v, t) => !!AUD[audioKey(v, t)];
const canonOf = q => q.type === "mc" || q.type === "odd" ? q.opts[0] : q.type === "tiles" ? q.orders[0] : q.type === "match" ? "" : expandAll(q.accept)[0];
const fillOf = (q, correct) => correct.replace(/ (해요|합니다)$/, m => /해요|합니다/.test(q.ko) ? "" : m);
const SPK = '<svg width="16" height="16" viewBox="0 0 16 16"><path d="M2 6h3l4-3v10l-4-3H2z" fill="currentColor"/><path d="M11 5.5c1.3 1.2 1.3 3.8 0 5M12.8 3.8c2.3 2.2 2.3 6.200 0 8.400" stroke="currentColor" fill="none" stroke-width="1.3"/></svg>';
const ttsBtn = (t, v, span) => { v = v || VOICE_F; const a = `class="tts${hasRec(v, t) ? " rec" : ""}" data-say="${esc(t)}" data-v="${v}" aria-label="Play audio"`;
  return span ? `<span ${a} role="button" tabindex="0">${SPK}</span>` : `<button ${a} type="button">${SPK}</button>`; };
function sheet(ko, fill, v) {
  const h = esc(ko).replace(/___/g, fill != null ? `<span class="filled">${esc(fill)}</span>` : '<span class="blank"></span>');
  return `<div class="sheet"><div class="say"><div class="ko" lang="ko">${h}</div>${fill != null || !/___/.test(ko) ? ttsBtn(ko.replace(/___/g, fill || ""), v) : ""}</div></div>`;
}
function lineHtml(l, lock) {                                // lock: the question asks what was said, so the translation waits for the answer
  const c = C.cast[l.c];
  return `<div class="line"><span class="chip"><b class="ko">${esc(c.name)}</b><span>${esc(c.rel + " · " + c.role)}</span></span>${sheet(l.ko, undefined, voiceOf(l.c))}
    ${l.en && !lock ? `<button class="tr" type="button" data-en="${esc(l.en)}">Show translation</button>`
      : l.en ? `<button class="tr open" type="button" data-en="${esc(l.en)}" data-lock="1" disabled>Translation appears once you have answered.</button>`
      : '<span class="tr open">Translation appears once you have answered.</span>'}</div>`;
}
function wire(root) {
  $$(".tr[data-en]", root).forEach(b => b.onclick = () => { if (b.dataset.lock) return; b.textContent = b.dataset.en; b.classList.add("open"); });
  $$(".tts[data-say]", root).forEach(b => { b.onclick = e => { e.stopPropagation(); say(b.dataset.say, b.dataset.v, b); };
    b.onkeydown = e => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); b.onclick(e); } }; });
}
let koVoice = null;
function findVoice() { try { koVoice = speechSynthesis.getVoices().find(v => /^ko/i.test(v.lang)) || null; document.body.classList.toggle("tts-ok", !!koVoice); } catch (e) {} }
function speak(t) { return new Promise(res => { try { speechSynthesis.cancel(); const u = new SpeechSynthesisUtterance(sayText(t)); u.lang = "ko-KR"; u.voice = koVoice; u.rate = .9; u.onend = u.onerror = () => res(); speechSynthesis.speak(u); } catch (e) { res(); } }); }
/* One shared <audio> for every clip. Safari, iOS and Android WebView let an element play only after a tap,
   and remember that per element: the first tap unlocks it (with a few ms of silence), so a whole column can
   then play sentence after sentence. A new Audio() per sentence would be blocked after the first one. */
const SILENT = "data:audio/mpeg;base64,//NwwAAAAAAAAAAAAEluZm8AAAAPAAAABAAAAlgAenp6enp6enp6enp6enp6enp6enp6enp6pqampqampqampqampqampqampqampqamptPT09PT09PT09PT09PT09PT09PT09PT09P/////////////////////////////////AAAAAExhdmM2MC4zMQAAAAAAAAAAAAAAACQCcQAAAAAAAAJY+/rsqgAAAAAAAAAAAAAAAAD/80DEAAAAA0gAAAAATEFNRTMuMTAwVVVVVVVVVVVVVUxBTUUzLjEwMFVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVf/zQsRbAAADSAAAAABVVVVVVVVVVVVVVVVVVVVVVVVVVUxBTUUzLjEwMFVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVf/zQMSkAAADSAAAAABVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVV//NCxKMAAANIAAAAAFVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVV";
const AU = { el: null, url: "", tok: 0, btn: null, bundles: {}, unlocked: false };
const player = () => AU.el || (AU.el = new Audio());
function unlockAudio() {                                      // call synchronously inside the tap
  if (AU.unlocked) return; const a = player(); a.src = SILENT;
  const p = a.play(); if (p && p.then) p.then(() => { AU.unlocked = true; }, () => {});
}
function stopSay() {
  AU.tok++; if (AU.el) { AU.el.onended = AU.el.onerror = null; AU.el.pause(); }
  if (AU.url) { URL.revokeObjectURL(AU.url); AU.url = ""; } try { speechSynthesis.cancel(); } catch (e) {}
  if (AU.btn) { AU.btn.classList.remove("on"); AU.btn = null; }
}
async function clipUrl(k) {                                  // -> a playable URL for a recording, or "" if there is none
  const e = AUD[k]; if (!e) return "";
  if (typeof GG_AUDIO_LOOSE !== "undefined") return "a/" + k + ".mp3";
  const B = AU.bundles, p = B[e[0]] || (B[e[0]] = fetch((window.GG_AUDIO_BASE || "audio/") + e[0] + ".mp3").then(r => { if (!r.ok) throw 0; return r.arrayBuffer(); }));
  try { const buf = await p; return URL.createObjectURL(new Blob([buf.slice(e[1], e[1] + e[2])], { type: "audio/mpeg" })); }
  catch (x) { delete B[e[0]]; return ""; }
}
async function playOne(v, t, tok) {                          // resolves when the clip has finished (or failed)
  const url = await clipUrl(audioKey(v, t)); if (tok !== AU.tok) return;
  if (!url) return koVoice ? speak(t) : undefined;
  if (url.startsWith("blob:")) AU.url = url;
  const a = player(); a.src = url;
  await new Promise(res => { a.onended = a.onerror = () => res(); a.play().catch(() => res()); });
  if (AU.url === url) { URL.revokeObjectURL(url); AU.url = ""; }
}
async function sayAll(list, btn) {                           // list: [[voice, text], ...] played one after another
  const again = btn && AU.btn === btn; stopSay(); if (again) return;   // a second tap on the playing button stops it
  unlockAudio();
  const tok = AU.tok; if (btn) { AU.btn = btn; btn.classList.add("on"); }
  for (const [v, t] of list) { await playOne(v, t, tok); if (tok !== AU.tok) return; }
  if (AU.btn === btn && btn) { btn.classList.remove("on"); AU.btn = null; }
}
const say = (t, v, btn) => sayAll([[v || VOICE_F, t]], btn);
const readVoice = (r, t) => { const sp = t[2]; if (!sp || sp === "나") return VOICE_F;
  const id = Object.keys(C.cast).find(k => C.cast[k].name.includes(sp) || sp.includes(C.cast[k].name.split(" ")[0])); return id ? voiceOf(id) : VOICE_F; };
/* Everything that has a play button, in order, one entry per recording: {k, b (bundle), v, t, kind, ref}.
   Questions with a gap are recorded with the first accepted answer filled in, as they show after answering. */
function audioList() {
  const out = [], seen = new Set();
  const add = (b, v, t, kind, ref) => { t = sayText(t); if (!t || /___/.test(t) || !/[가-힣]/.test(t)) return;
    const k = audioKey(v, t); if (seen.has(k)) return; seen.add(k); out.push({ k, b, v, t, kind, ref }); };
  const addQ = (b, q, ref) => { if (!q || !q.ko) return; let t = q.ko;
    if (/___/.test(t)) { const c = canonOf(q); if (!c) return; t = t.replace(/___/g, fillOf(q, c)); } add(b, qVoice(q), t, "task", ref); };
  allCh().forEach(ch => {
    const n = ch === C.finale ? "f" : ch.id.replace(/^ch/, ""), u = "u" + n;
    ch.cases.forEach(cs => {
      (cs.scenes || []).forEach((sc, i) => { const ref = cs.no + " · scene " + (i + 1);
        (sc.lines || []).forEach(l => add(u, voiceOf(l.c), l.ko, "line", ref)); addQ(u, sc.q, ref);
        ((sc.after && sc.after.lines) || []).forEach(l => add(u, voiceOf(l.c), l.ko, "line", ref)); });
      (cs.clues || []).forEach((q, i) => addQ(u, q, cs.no + " · clue " + (i + 1)));
    });
    (ch.reads || []).forEach(r => r.text.forEach((t, i) => add(u, readVoice(r, t), t[0], "read", r.id + " · " + (i + 1))));
    if (ch !== C.finale) deck(ch).forEach(c => { add("k" + n, VOICE_F, c.ko, "card", c.id); if (c.seen) add("k" + n, VOICE_F, c.seen.ko, "cardex", c.id); });
  });
  mnAudio(add);                                              // Mnemo Hooks: its own bundles m1 … m14, its own speed
  return out;
}

/* Tiles for an answer that used to be typed. Whole sentences are built from word tiles,
   short forms and single words from syllable tiles. Wrong tiles come from the question's own
   listed mistakes (wrong ending, wrong speech level, wrong particle). */
/* Syllables a learner could plausibly reach for instead of the right one: the stem with or without
   its final consonant (딸/따, 들/듣/드), commonly confused endings (까/가, 을/를), and one-letter
   spelling slips (ㅐ/ㅔ, ㅓ/ㅗ, plain/aspirated/tense consonants). Most tempting first. */
const END_MIX = { "줄": ["쭐"], "고": ["구"], "까": ["가"], "을": ["를", "으"], "를": ["을"], "면": ["며"], "서": ["써"], "세": ["새"], "요": ["여"], "으": ["을"], "습": ["슴"], "니": ["이"] };
const V_MIX = { "ㅐ": "ㅔ", "ㅔ": "ㅐ", "ㅓ": "ㅗ", "ㅗ": "ㅓ", "ㅡ": "ㅜ", "ㅜ": "ㅡ", "ㅕ": "ㅛ", "ㅛ": "ㅕ", "ㅚ": "ㅙ", "ㅙ": "ㅚ", "ㅢ": "ㅣ", "ㅘ": "ㅏ", "ㅝ": "ㅓ", "ㅟ": "ㅣ", "ㅒ": "ㅖ", "ㅖ": "ㅒ" };
const C_MIX = { "ㄱ": "ㅋ", "ㅋ": "ㄱ", "ㄲ": "ㄱ", "ㄷ": "ㅌ", "ㅌ": "ㄷ", "ㄸ": "ㄷ", "ㅂ": "ㅍ", "ㅍ": "ㅂ", "ㅃ": "ㅂ", "ㅈ": "ㅊ", "ㅊ": "ㅈ", "ㅉ": "ㅈ", "ㅅ": "ㅆ", "ㅆ": "ㅅ" };
const V2 = { "ㅏ": "ㅓ", "ㅠ": "ㅜ", "ㅣ": "ㅡ", "ㅑ": "ㅕ" };
const T_FORM = { "ㄹ": "ㄷ", "ㄷ": "ㄹ" }, T_SPELL = { "ㄴ": "ㅇ", "ㅇ": "ㄴ", "ㅁ": "ㅂ", "ㅂ": "ㅁ" };
function lookalikes(ch, spell) {
  if (!isSyl(ch)) return [];
  const n = ch.charCodeAt(0) - 0xAC00, l = Math.floor(n / 588), v = Math.floor(n % 588 / 28), t = n % 28;
  const mk = (L, V, T) => String.fromCharCode(0xAC00 + L * 588 + V * 28 + T), J = JONG[t];
  const vow = V_MIX[JUNG[v]] ? [mk(l, JUNG.indexOf(V_MIX[JUNG[v]]), t)] : [], con = C_MIX[CHO[l]] ? [mk(CHO.indexOf(C_MIX[CHO[l]]), v, t)] : [];
  const out = spell
    ? [...vow, ...con, ...(T_SPELL[J] ? [mk(l, v, JONG.indexOf(T_SPELL[J]))] : []), ...(t ? [mk(l, v, 0)] : []), ...(V2[JUNG[v]] ? [mk(l, JUNG.indexOf(V2[JUNG[v]]), t)] : []), ...(J === "ㄱ" ? [mk(l, v, 21)] : [])]          // spelling slips
    : [...(END_MIX[ch] || []), t ? mk(l, v, 0) : mk(l, v, 8), ...(T_FORM[J] && "듣걷묻싣들걸물실".includes(mk(l, v, JONG.indexOf(T_FORM[J]))) ? [mk(l, v, JONG.indexOf(T_FORM[J]))] : []), ...vow, ...con]; // 딸/따, 들/듣, 지/질
  return [...new Set(out)].filter(x => x !== ch);
}
function buildTiles(q) {
  const acc = expandAll(q.accept), clean = t => t.replace(/[.,!?~]/g, ""), words = clean(acc[0]).split(" ");
  const bad = (q.diag || []).map(d => expand(d.p[0])[0]).concat((q.diag || []).flatMap(d => expandAll(d.p)));
  const okW = new Set(acc.flatMap(v => clean(v).split(" ")));
  let extra = [...new Set(bad.flatMap(v => clean(v).split(" ")))].filter(t => t && !okW.has(t)), mode = "w", good = words;
  if (q.type !== "write" || words.length < 3 || !extra.length) {
    mode = "s"; good = [...norm(acc[0])]; const have = new Set(good);
    extra = [...new Set(bad.flatMap(v => [...norm(v)]))].filter(t => !have.has(t)).slice(0, 4);
    const spell = !!q.spell;
    if (!spell) for (const t of ["을", "으"]) if (!have.has(t) && !extra.includes(t)) extra.push(t);
    const lists = good.filter((g, i) => good.indexOf(g) === i).map(g => lookalikes(g, spell)), want = Math.min(8, Math.max(6, good.length + 2)) + (spell ? 0 : 1);
    for (let k = 0; k < 6 && extra.length < want; k++) for (const l of lists) { const t = l[k]; if (t && !have.has(t) && !extra.includes(t) && extra.length < want) extra.push(t); }
    if (S.repairs.pa) extra = extra.slice(0, Math.max(2, extra.length - 2));
    return { mode, good, extra };
  }
  extra = extra.slice(0, 4); if (S.repairs.pa) extra = extra.slice(0, Math.max(1, extra.length - 2));
  return { mode, good, extra };
}

/* Tiles: tap to place or remove, or drag. A tile in the sentence can be dragged to a new place (the others make room as it moves);
   a tile can be dragged from the bank straight to a spot in the sentence, and from the sentence back to the bank. */
function tileBoard(box, isDone) {
  const tray = $("#tray", box), bank = $("#bank", box), chosen = [];
  let drag = null, eatClick = false;
  const draw = () => {
    tray.innerHTML = chosen.map((b, i) => `<button class="tile ko" lang="ko" type="button" data-k="${i}">${esc(b.textContent)}</button>`).join("");
    $$(".tile", tray).forEach(t => { t.onclick = () => { if (eatClick || isDone()) return; chosen.splice(+t.dataset.k, 1)[0].classList.remove("used"); draw(); };
      t.addEventListener("pointerdown", e => down(e, { from: "tray", k: +t.dataset.k, el: t })); });
  };
  $$(".tile", bank).forEach(b => { b.onclick = () => { if (eatClick || isDone() || b.classList.contains("used")) return; b.classList.add("used"); chosen.push(b); draw(); };
    b.addEventListener("pointerdown", e => down(e, { from: "bank", btn: b, el: b })); });
  const over = (el, x, y, pad) => { const r = el.getBoundingClientRect(); return x >= r.left - pad && x <= r.right + pad && y >= r.top - pad && y <= r.bottom + pad; };
  const slotAt = (x, y) => {                               // where in the sentence the pointer is, as an index
    const ts = $$(".tile:not(.ph)", tray); let i = 0;
    for (; i < ts.length; i++) { const r = ts[i].getBoundingClientRect(); if (y < r.top) break; if (y <= r.bottom && x < r.left + r.width / 2) break; }
    return i;
  };
  function down(e, src) {
    if (isDone() || (e.pointerType === "mouse" && e.button !== 0) || (src.from === "bank" && src.btn.classList.contains("used"))) return;
    drag = { src, x0: e.clientX, y0: e.clientY, on: false, id: e.pointerId };
    document.addEventListener("pointermove", move, { passive: false }); document.addEventListener("pointerup", up); document.addEventListener("pointercancel", up);
  }
  function start(e) {
    const s = drag.src, item = s.from === "tray" ? chosen[s.k] : s.btn;
    drag.item = item; drag.on = true;
    const r = s.el.getBoundingClientRect();
    const g = drag.ghost = document.createElement("div"); g.className = "tile ko ghost"; g.textContent = item.textContent; g.setAttribute("lang", "ko");
    g.style.width = r.width + "px"; drag.dx = e.clientX - r.left; drag.dy = e.clientY - r.top; document.body.appendChild(g);
    const ph = drag.ph = document.createElement("span"); ph.className = "tile ko ph"; ph.textContent = item.textContent;
    if (s.from === "tray") { chosen.splice(s.k, 1); s.el.replaceWith(ph); $$(".tile:not(.ph)", tray).forEach((t, i) => t.dataset.k = i); }
    else item.classList.add("used");
    document.body.classList.add("dragging");
  }
  function move(e) {
    if (!drag) return;
    if (!drag.on) { if (Math.hypot(e.clientX - drag.x0, e.clientY - drag.y0) < 7) return; start(e); }
    e.preventDefault();
    drag.ghost.style.transform = `translate(${e.clientX - drag.dx}px, ${e.clientY - drag.dy}px)`;
    if (over(tray, e.clientX, e.clientY, 18)) {
      const ts = $$(".tile:not(.ph)", tray), i = slotAt(e.clientX, e.clientY);
      if (ts[i]) { if (drag.ph.nextSibling !== ts[i] || !drag.ph.parentNode) tray.insertBefore(drag.ph, ts[i]); } else if (tray.lastChild !== drag.ph) tray.appendChild(drag.ph);
      bank.classList.remove("drop");
    } else { if (drag.ph.parentNode) drag.ph.remove(); bank.classList.toggle("drop", over(bank, e.clientX, e.clientY, 18)); }
  }
  function up() {
    document.removeEventListener("pointermove", move); document.removeEventListener("pointerup", up); document.removeEventListener("pointercancel", up);
    const d = drag; drag = null; if (!d || !d.on) return;
    const into = d.ph.parentNode === tray;
    if (into) { const i = [...tray.children].filter(t => t === d.ph || !t.classList.contains("ph")).indexOf(d.ph); chosen.splice(i, 0, d.item); d.item.classList.add("used"); }
    else d.item.classList.remove("used");
    d.ghost.remove(); bank.classList.remove("drop"); document.body.classList.remove("dragging");
    eatClick = true; setTimeout(() => { eatClick = false; }, 0);
    draw();
  }
  draw();
  return chosen;
}
/* ask(q, box, opts, done): opts {pay, quiet}. done({ok}) fires after the player taps Continue. */
function ask(q, box, o, done) {
  o = o || {}; window.__game.q = q;
  const letters = "abcde", sk = C.skills[q.skill];
  let finished = false, hintOpen = !!S.repairs.pa;
  const order = q.type === "mc" || q.type === "odd" ? shuffle(q.opts.map((t, i) => ({ t, i }))) : [];
  let body = "";
  if (q.type === "mc" || q.type === "odd") body = `<div class="opts">${order.map((x, n) => `<button class="opt" type="button" data-i="${x.i}"><i>${letters[n]})</i><span class="${q.enOpts ? "en" : "ko"}" ${q.enOpts ? "" : 'lang="ko"'}>${esc(x.t)}</span></button>`).join("")}</div>`;
  const typedQ = q.type === "fill" || q.type === "write", build = typedQ && !S.typing ? buildTiles(q) : null;
  const swap = `<button class="kbt" id="swap" type="button" style="margin-left:0">${S.typing ? "Use tiles instead" : "Type it instead (+₩300)"}</button>`;
  if (build) body = `<div class="tray" id="tray" aria-label="Your answer"></div><div class="bank" id="bank">${shuffle([...build.good, ...build.extra]).map((t, i) => `<button class="tile ko" lang="ko" type="button" data-n="${i}">${esc(t)}</button>`).join("")}</div>
    <div class="row" style="margin-top:12px"><button class="btn" id="go" type="button">File it</button></div><div class="tools">${swap}</div>`;
  if (typedQ && !build) body = `<div class="typed"><input id="ans" type="text" lang="ko" autocomplete="off" autocapitalize="off" autocorrect="off" spellcheck="false" enterkeyhint="done" placeholder="${q.type === "fill" ? "missing part" : "whole sentence"}" aria-label="Your answer in Korean"><button class="btn" id="go" type="button">File it</button></div>
    <div class="tools"><button class="link" id="hintb" type="button">${hintOpen ? "" : "Show the words you need"}</button>${swap}<button class="kbt ${S.osk ? "on" : ""}" id="kbt" type="button" aria-pressed="${S.osk}" title="On-screen Korean keyboard">한글 keys</button></div><div class="hints" id="hints"></div>`;
  if (q.type === "tiles") body = `<div class="tray" id="tray" aria-label="Your sentence"></div><div class="bank" id="bank">${shuffle([...q.tiles, ...q.extra]).map((t, i) => `<button class="tile ko" lang="ko" type="button" data-n="${i}">${esc(t)}</button>`).join("")}</div><div class="row" style="margin-top:12px"><button class="btn" id="go" type="button">File it</button></div>`;
  if (q.type === "match") { const L = shuffle(q.pairs.map((p, i) => ({ t: p[0], i }))), Rr = shuffle(q.pairs.map((p, i) => ({ t: p[1], i })));
    const ko2 = /[가-힣]/.test(q.pairs[0][1]);
    body = `<div class="match">${L.map((l, n) => `<button type="button" class="ko" lang="ko" data-s="l" data-i="${l.i}">${esc(l.t)}</button><button type="button" class="${ko2 ? "ko" : ""}" data-s="r" data-i="${Rr[n].i}">${esc(Rr[n].t)}</button>`).join("")}</div>`; }
  box.innerHTML = `<div class="card qc">${q.reopened ? `<div class="reopen">REOPENED · ${esc(sk.name)}</div>` : ""}${o.x2 ? '<div class="reopen">WEAK SPOT · DOUBLE PAY</div>' : ""}
    ${whoRow(q)}<p class="ask">${esc(q.ask)}${q.sub ? ` <span style="font-weight:400;color:var(--ink-soft)">(${esc(q.sub)})</span>` : ""}</p>
    ${q.examples ? `<div class="ex">${q.examples.map(e => `<div lang="ko">${esc(e[0])}<i>→</i>${esc(e[1])}</div>`).join("")}</div>` : ""}
    ${q.ko ? `<div id="qsheet">${sheet(q.ko, undefined, qVoice(q))}</div>` : ""}${body}<div class="fb" id="fb" hidden></div></div>`;
  wire(box);

  function finish(ok, extra) {
    if (finished) return; finished = true; oskBind(null);
    $$("button.opt,button.tile,#go,.match button,#ans", box).forEach(b => b.disabled = true);
    rec(q.skill, ok, q.reopened);
    let pay = 0; if (ok && o.pay) { pay = (o.pay + bonus() + (typedQ && !build ? 300 : 0)) * (o.x2 ? 2 : 1); earn(pay); }
    const correct = q.type === "mc" || q.type === "odd" || q.type === "tiles" || q.type === "match" ? canonOf(q) : (extra && extra.canon) || canonOf(q);
    if (q.ko && /___/.test(q.ko) && correct) { $("#qsheet", box).innerHTML = sheet(q.ko, fillOf(q, correct), qVoice(q)); wire($("#qsheet", box)); }
    const showAns = !ok && correct && !(q.ko && /___/.test(q.ko)) && q.type !== "odd" && !q.enOpts;
    if (R.sceneBox) $$(".tr[data-lock]", R.sceneBox).forEach(b => { delete b.dataset.lock; b.disabled = false; b.classList.remove("open"); b.textContent = "Show translation"; });
    const fb = $("#fb", box); fb.hidden = false;
    fb.innerHTML = `<div class="stamp ${ok ? "ok" : ""}"><span>${ok ? "<b>FILED</b>case desk" : "<b>RETURN</b>to sender"}</span></div>
      <p class="quip">${esc(pick(ok ? C.quips.right : C.quips.wrong))}</p>
      ${extra && extra.msg ? `<p class="notice">${esc(extra.msg)}</p>` : ""}
      ${extra && extra.note ? `<p class="notice">${esc(extra.note)}</p>` : ""}
      ${showAns ? `<span class="ans ko" lang="ko">${esc(correct)}</span>` : ""}
      ${!ok || o.alwaysWhy ? `<p>${esc(q.why || "")}</p>` : ""}
      ${q.en ? `<p class="narr" style="font-size:14.5px;color:var(--ink-soft)">${esc(q.en)}</p>` : ""}
      ${pay ? `<p class="pay">+ ${won(pay)}</p>` : ""}
      <div id="afterbox"></div><div class="row" style="margin-top:12px"><button class="btn" id="cont" type="button">Continue</button></div>`;
    if (o.after) { $("#afterbox", box).innerHTML = o.after; wire(fb); }
    if (R.sceneBox) $$(".line span.tr.open", R.sceneBox).forEach(s => { if (q.en && /appears/.test(s.textContent)) s.textContent = q.en; });
    const c = $("#cont", box); c.onclick = () => done({ ok }); c.focus({ preventScroll: true });
    fb.scrollIntoView({ block: "nearest", behavior: "smooth" });
  }

  if (q.type === "mc" || q.type === "odd") $$(".opt", box).forEach(b => b.onclick = () => {
    const ok = b.dataset.i === "0"; b.classList.add(ok ? "right" : "wrong");
    if (!ok) $(`.opt[data-i="0"]`, box).classList.add("right"); finish(ok);
  });
  const camera = r => {
    if (r.ok || !S.repairs.cam || R.camUsed || R.phase == null) return false;
    R.camUsed = true; const fb = $("#fb", box); fb.hidden = false;
    fb.innerHTML = `<p class="notice">Camera playback: we have both now watched that again, and it was not it. ${esc(r.msg || "Look at the ending and the particles.")} One more try this phase.</p>`; return true;
  };
  if (typedQ) $("#swap", box).onclick = () => { S.typing = !S.typing; save(); oskBind(null); ask(q, box, o, done); };
  if (build) {
    const chosen = tileBoard(box, () => finished);
    $("#go", box).onclick = () => { if (finished || !chosen.length) return;
      const r = judge(q, chosen.map(b => b.textContent).join(build.mode === "w" ? " " : ""), build.mode === "s");
      if (!camera(r)) finish(r.ok, r); };
  }
  if (typedQ && !build) {
    const inp = $("#ans", box), hints = () => { $("#hints", box).innerHTML = (q.hint || []).map(h => `<span lang="ko">${esc(h)}</span>`).join(""); $("#hintb", box).hidden = true; };
    if (hintOpen) hints(); $("#hintb", box).onclick = hints;
    const submit = () => {
      if (finished || !norm(inp.value)) return;
      const r = judge(q, inp.value);
      if (camera(r)) { inp.focus(); return; }
      finish(r.ok, r);
    };
    R.submit = submit; $("#go", box).onclick = submit;
    inp.addEventListener("keydown", e => { if (e.key === "Enter") { if (e.isComposing || e.keyCode === 229) return; e.preventDefault(); submit(); } });
    $("#kbt", box).onclick = () => { S.osk = !S.osk; save(); $("#kbt", box).classList.toggle("on", S.osk); $("#kbt", box).setAttribute("aria-pressed", S.osk); oskBind(inp); if (S.osk) inp.focus(); };
    oskBind(inp);
    if (!o.noFocus && !S.osk && matchMedia("(pointer:fine)").matches) inp.focus({ preventScroll: true });
  }
  if (q.type === "tiles") {
    const chosen = tileBoard(box, () => finished);
    $("#go", box).onclick = () => { if (!chosen.length) return; const said = chosen.map(b => b.textContent).join(" "); finish(q.orders.includes(said) || reorderOK(q.orders[0], said)); };
  }
  if (q.type === "match") {
    let sel = null, miss = 0, left = q.pairs.length;
    $$(".match button", box).forEach(b => b.onclick = () => {
      if (b.classList.contains("ok")) return;
      if (!sel || sel.dataset.s === b.dataset.s) { if (sel) sel.classList.remove("sel"); sel = b; b.classList.add("sel"); return; }
      if (sel.dataset.i === b.dataset.i) { sel.classList.remove("sel"); sel.classList.add("ok"); b.classList.add("ok"); left--; }
      else { miss++; const a = sel; a.classList.remove("sel"); [a, b].forEach(x => { x.classList.add("no"); setTimeout(() => x.classList.remove("no"), 320); }); }
      sel = null; if (!left) finish(miss <= 1, miss ? { note: miss + " wrong pairing" + (miss > 1 ? "s" : "") + " on the way." + (miss <= 1 ? " One is forgiven." : "") } : null);
    });
  }
}

/* ---------------- On-screen 2-set keyboard ---------------- */
const ROWS = [["ㅂ", "ㅈ", "ㄷ", "ㄱ", "ㅅ", "ㅛ", "ㅕ", "ㅑ", "ㅐ", "ㅔ"], ["ㅁ", "ㄴ", "ㅇ", "ㄹ", "ㅎ", "ㅗ", "ㅓ", "ㅏ", "ㅣ"], ["ㅋ", "ㅌ", "ㅊ", "ㅍ", "ㅠ", "ㅜ", "ㅡ"]];
const SHIFT = { "ㅂ": "ㅃ", "ㅈ": "ㅉ", "ㄷ": "ㄸ", "ㄱ": "ㄲ", "ㅅ": "ㅆ", "ㅐ": "ㅒ", "ㅔ": "ㅖ" };
const K = { inp: null, base: "", c: { L: "", V: [], T: [] }, shift: false };
const emptyC = () => ({ L: "", V: [], T: [] });
const compText = c => (c.L || c.V.length ? joinSyl(c) : "");
function kPut() { K.inp.value = K.base + compText(K.c); K.inp.scrollLeft = 1e5; }
function kCommit() { K.base += compText(K.c); K.c = emptyC(); }
function kType(j) {
  const c = K.c, vowel = JUNG.includes(j);
  if (vowel) {
    if (c.T.length) { const last = c.T.pop(); kCommit(); K.c = { L: last, V: [j], T: [] }; }
    else if (c.V.length === 1 && VV[c.V[0] + j]) c.V.push(j);
    else if (c.L && !c.V.length) c.V.push(j);
    else { kCommit(); K.c = { L: "", V: [j], T: [] }; }
  } else {
    if (c.L && c.V.length && !c.T.length && JONG.includes(j)) c.T.push(j);
    else if (c.L && c.V.length && c.T.length === 1 && TT[c.T[0] + j]) c.T.push(j);
    else { kCommit(); K.c = { L: j, V: [], T: [] }; }
  }
  kPut();
}
function kBack() {
  const c = K.c;
  if (!c.L && !c.V.length) { // nothing composing: reopen the last syllable so one jamo goes at a time
    const last = K.base.slice(-1); if (!last) return;
    K.base = K.base.slice(0, -1);
    if (isSyl(last)) K.c = splitSyl(last); else { kPut(); return; }
  }
  const d = K.c; if (d.T.length) d.T.pop(); else if (d.V.length) d.V.pop(); else d.L = "";
  kPut();
}
function oskDraw() {
  const el = $("#osk"), show = !!(S.osk && K.inp && K.inp.isConnected && !K.inp.disabled);
  el.hidden = !show; document.body.classList.toggle("osk-on", show);
  if (!show) return;
  const key = j => { const s = K.shift && SHIFT[j] ? SHIFT[j] : j; return `<button type="button" data-j="${s}">${s}</button>`; };
  el.innerHTML = `<div class="r">${ROWS[0].map(key).join("")}</div><div class="r">${ROWS[1].map(key).join("")}</div>
    <div class="r"><button type="button" class="fn ${K.shift ? "on" : ""}" data-f="shift" aria-label="Shift">shift</button>${ROWS[2].map(key).join("")}<button type="button" class="fn" data-f="back" aria-label="Delete one letter">del</button></div>
    <div class="r"><button type="button" class="fn" data-j=",">,</button><button type="button" class="sp" data-f="space" aria-label="Space">space</button><button type="button" class="fn" data-j="?">?</button><button type="button" class="ent" data-f="enter">enter</button></div>`;
  document.body.style.setProperty("--osk-h", el.offsetHeight + 14 + "px");
}
function oskBind(inp) {
  K.inp = inp; K.c = emptyC(); K.shift = false; K.base = inp ? inp.value : "";
  if (inp) {
    inp.setAttribute("inputmode", S.osk ? "none" : "text");
    if (!inp._k) { inp._k = 1; inp.addEventListener("input", () => { K.base = inp.value; K.c = emptyC(); }); } // system keyboard typed: start from its text
  }
  oskDraw();
  if (inp && S.osk) setTimeout(() => { const card = inp.closest(".card"), sh = card && $("#qsheet", card), r = inp.getBoundingClientRect(), lim = innerHeight - $("#osk").offsetHeight - 12;
    if (r.bottom > lim || r.top < 60) window.scrollBy(0, r.bottom - lim + 4); void sh; }, 60);
}
function oskInit() {
  const el = $("#osk");
  el.addEventListener("pointerdown", e => {
    const b = e.target.closest("button"); e.preventDefault(); if (!b || !K.inp) return;
    const f = b.dataset.f, j = b.dataset.j;
    if (f === "shift") { K.shift = !K.shift; return oskDraw(); }
    if (f === "back") return kBack();
    if (f === "space") { kCommit(); K.base += " "; return kPut(); }
    if (f === "enter") { kCommit(); kPut(); return R.submit && R.submit(); }
    if (j === "," || j === "?") { kCommit(); K.base += j; return kPut(); }
    kType(j); if (K.shift) { K.shift = false; oskDraw(); }
  });
}
window.__osk = { type: kType, back: kBack, state: K }; // test hook

/* ---------------- Home: the notice board ---------------- */
/* Lost & found is choice only (no typing). Filed: right in two kinds of question. Gold: right in every kind
   the word has, and twice more after that. Gold won by spelling in older versions (t.w) stays gold. */
const vKinds = t => Object.keys(t).filter(k => k !== "n").length;
const vGold = (ch, i, t) => !!t && (!!t.w || (wordTypes(ch, i).every(k => t[k]) && (t.n || 0) >= wordTypes(ch, i).length + 2));
function vstat(ch) {
  const v = S.vocab[ch.id] || { w: {} }; let f = 0, g = 0;
  ch.vocab.forEach((_, i) => { const t = v.w[i]; if (!t) return; if (vGold(ch, i, t)) g++; else if (vKinds(t) >= 2) f++; });
  return { f, g, n: ch.vocab.length };
}
function drawSave() {
  const el = $("#savebar"); if (!el) return;
  const m = { wait: ["wait", "Fetching your file from the cabinet. The board unlocks when it arrives."], on: ["on", store.local ? "Progress is saved on this device. A transfer code at the bottom moves it to another one." : "Progress is saved to your account and follows you to other devices."], off: ["off", "Not saving: no account storage in this view, so progress lasts for this visit only."] }[store.state];
  el.className = "savebar " + m[0]; el.innerHTML = "<i></i><span>" + m[1] + "</span>";
}
const chDone = ch => ch.cases.filter(k => !/optional/i.test(k.kind)).every(k => S.cases[k.id]);   // the optional third file does not hold a chapter open
function currentCh() {                                    // the chapter you are working on
  if (S.resume) { const c = C.chapters.find(c => c.cases.some(k => k.id === S.resume.cs)); if (c) return c; }   // a final file in progress leaves the chapter list as it is
  return C.chapters.find(c => !chDone(c)) || C.chapters[C.chapters.length - 1];
}
function openCh() {                                       // the chapter shown unfolded
  const o = S.openCh; if (o && o.id === "") return null;   // everything folded
  const c = o && chById(o.id);
  if (c && !(chDone(c) && !o.done)) return c;             // you opened it yourself; once you finish it, the next one takes over
  return currentCh();
}
function nextFile() {
  if (S.resume) { for (const c of allCh()) { const k = c.cases.find(k => k.id === S.resume.cs); if (k) return { ch: c, cs: k, resume: true }; } }
  for (const c of C.chapters) { const k = c.cases.find((k, i) => !S.cases[k.id] && !/optional/i.test(k.kind) && (i === 0 || S.cases[c.cases[i - 1].id])); if (k) return { ch: c, cs: k }; }
  if (C.finale && !S.cases[C.finale.cases[0].id] && C.chapters.every(chDone)) return { ch: C.finale, cs: C.finale.cases[0] };
  for (const c of allCh()) { const k = c.cases.find((k, i) => !S.cases[k.id] && (i === 0 || S.cases[c.cases[i - 1].id])); if (k) return { ch: c, cs: k }; }
  return null;
}
function finBlock() {
  const F = C.finale; if (!F) return "";
  const k = F.cases[0], cl = S.cases[k.id], wait = store.state === "wait", n = C.chapters.filter(chDone).length;
  return `<section class="cork chapbox finale open" id="chap-fin" aria-label="Final file"><div class="chead"><span class="cno">★</span>
      <span class="chap"><b class="ko" lang="ko">${esc(F.title)}</b><span>${esc(F.sub)}</span></span></div>
    <div class="files"><button class="file" type="button" data-case="${k.id}" data-ch="${F.id}" ${wait ? "disabled" : ""}>
      ${cl ? '<span class="closed">CLOSED</span>' : ""}<span class="no">FILE ${k.no} · FINAL</span><h3>${esc(k.title)}</h3><p>${esc(k.blurb)}</p>
      <span class="tag"><span>${k.kind}</span><span>${S.resume && S.resume.cs === k.id ? "Resume: " + PH[S.resume.phase].toLowerCase() : cl ? "Play again" : "Open"}</span></span></button>
      <div class="note finnote"><b>Best after chapter 14</b><span>It is open now, but it uses something from every chapter. ${n} of ${C.chapters.length} chapters done.</span></div></div></section>`;
}
function setOpen(id) { const c = chById(id); S.openCh = { id, done: chDone(c) }; save(); home(id); }
function home(scrollTo) {
  const wait = store.state === "wait", anyClosed = closedChapters().length > 0, open = openCh(), cur = currentCh();
  const nx = nextFile();
  const cont = nx ? `<section class="contcard" aria-label="Continue"><div class="cc-l"><span class="cc-k">${nx.resume ? "Half-finished file" : "Next on the desk"} · chapter ${nx.ch.no}</span>
      <h2>FILE ${nx.cs.no} · ${esc(nx.cs.title)}</h2><p>${esc(nx.cs.blurb)}</p></div>
      <div class="cc-r"><button class="btn" type="button" data-case="${nx.cs.id}" data-ch="${nx.ch.id}" ${wait ? "disabled" : ""}>${nx.resume ? "Resume: " + PH[S.resume.phase].toLowerCase() : "Open the file"}</button>
      <div class="cc-mini"><button class="btn alt sm" type="button" data-cards="${nx.ch.id}" ${wait ? "disabled" : ""}>Card index</button><button class="btn alt sm" type="button" data-vocab="${nx.ch.id}" ${wait ? "disabled" : ""}>Lost &amp; found</button></div></div></section>`
    : `<section class="contcard" aria-label="Continue"><div class="cc-l"><span class="cc-k">Every file closed</span><h2>The desk is empty</h2><p>Nothing left but night duty, the drawers of cards, and the goat.</p></div>
      <div class="cc-r"><button class="btn" type="button" id="night2" ${wait ? "disabled" : ""}>Night duty</button></div></section>`;
  const jump = `<nav class="jump" aria-label="Jump to a chapter">${C.chapters.map(ch => `<button type="button" data-open="${ch.id}" class="${ch === open ? "on" : ""} ${chDone(ch) ? "done" : ""} ${ch === cur ? "cur" : ""}" aria-label="Chapter ${ch.no}">${String(ch.no).padStart(2, "0")}</button>`).join("")}</nav>`;
  const chapters = C.chapters.map(ch => {
    const st = vstat(ch), cs = cstat(ch), isOpen = ch === open;
    const dots = ch.cases.map(k => `<i class="${S.cases[k.id] ? "c" : ""} ${/optional/i.test(k.kind) ? "o" : ""}" title="FILE ${k.no}${S.cases[k.id] ? ": closed" : ""}"></i>`).join("");
    const body = `<div class="cbody" ${isOpen ? "" : "hidden"}>${ch.grammar ? `<details class="gram"><summary>Grammar notes for this chapter</summary>${ch.grammar.map(g => `<section><h3 class="ko" lang="ko">${esc(g.pattern)}</h3><p>${esc(g.gist)}</p>
      <div class="gt">${g.rows.map(r => `<div><span>${esc(r[0])}</span><b class="ko" lang="ko">${esc(r[1])}</b><span class="ko" lang="ko">${esc(r[2])}</span></div>`).join("")}</div>
      <ul>${g.notes.map(n => `<li>${esc(n)}</li>`).join("")}</ul>
      ${g.ex.map(e => `<p class="gx"><span class="ko" lang="ko">${esc(e[0])}</span><em>${esc(e[1])}</em></p>`).join("")}</section>`).join("")}</details>` : ""}
    <div class="files">${ch.cases.map((k, i) => { const op = i === 0 || S.cases[ch.cases[i - 1].id], cl = S.cases[k.id];
      return `<button class="file ${op ? "" : "locked"}" type="button" data-case="${k.id}" data-ch="${ch.id}" ${op && !wait ? "" : "disabled"}>
        ${cl ? '<span class="closed">CLOSED</span>' : ""}<span class="no">FILE ${k.no}</span><h3>${esc(k.title)}</h3><p>${esc(k.blurb)}</p>
        <span class="tag"><span>${k.kind}</span><span>${S.resume && S.resume.cs === k.id ? "Resume: " + PH[S.resume.phase].toLowerCase() : cl ? "Play again" : op ? "Open" : "Locked: close the file before it"}</span></span></button>`; }).join("")}
      <button class="note" type="button" data-vocab="${ch.id}" ${wait ? "disabled" : ""}><b>Lost &amp; found</b><span>Ten tagged items a round. ${st.f + st.g} of ${st.n} words filed, ${st.g} gold.</span>
        <span class="meter"><i class="g" style="width:${st.g / st.n * 100}%"></i><i style="width:${st.f / st.n * 100}%"></i></span></button>
      <button class="note idx" type="button" data-cards="${ch.id}" ${wait ? "disabled" : ""}><b>Card index</b><span>Flashcards, both ways. ${cs.n} cards: ${cs.b[2]} closed, ${cs.b[1]} pending, ${cs.b[0]} open or new.</span>
        <span class="meter"><i style="width:${cs.b[2] / cs.n * 100}%"></i><i class="g" style="width:${cs.b[1] / cs.n * 100}%"></i></span></button>${mnCards(ch).length ? (() => { const m = mnStat(mnCards(ch));
        return `<button class="note mh" type="button" data-mnemo="${ch.id}" ${wait ? "disabled" : ""}><b>Mnemo Hooks</b><span lang="cs">Slovíčka s českými háčky, kořeny a SRS. ${m.n} slov: ${m.b[2]} umím, ${m.b[1]} učím se, ${m.b[0]} nových.${m.due ? ` K opakování: ${m.due}.` : ""}</span>
        <span class="meter"><i style="width:${m.b[2] / m.n * 100}%"></i><i class="g" style="width:${m.b[1] / m.n * 100}%"></i></span></button>`; })() : ""}${ch.reads ? (() => { const nr = ch.reads.filter(r => (S.reads || {})[r.id]).length;
        return `<button class="note news" type="button" data-read="${ch.id}" ${wait ? "disabled" : ""}><b>Village newsletter</b><span>A short column in Korean and three questions on it. ${nr} of ${ch.reads.length} read.</span>
        <span class="meter"><i style="width:${nr / ch.reads.length * 100}%"></i></span></button>`; })() : ""}</div></div>`;
    return `<section class="cork chapbox ${isOpen ? "open" : ""} ${chDone(ch) ? "done" : ""}" id="chap-${ch.id}" aria-label="Chapter ${ch.no}">
      <button class="chead" type="button" data-open="${ch.id}" aria-expanded="${isOpen}"><span class="cno">${String(ch.no).padStart(2, "0")}</span>
      <span class="chap"><b class="ko" lang="ko">${esc(ch.title)}</b><span>${esc(ch.sub)}</span></span>
      <span class="cstat"><span class="dots" aria-label="${ch.cases.filter(k => S.cases[k.id]).length} of ${ch.cases.length} files closed">${dots}</span>
        <span class="mm" title="Words filed"><i style="width:${(st.f + st.g) / st.n * 100}%"></i></span><span class="mm k" title="Cards closed"><i style="width:${cs.b[2] / cs.n * 100}%"></i></span></span>
      <span class="chev" aria-hidden="true"></span></button>${body}</section>`;
  }).join("");
  const ev = allCh().flatMap(c => c.cases).filter(k => S.souvenirs.includes(k.souvenir.id)).map(k => k.souvenir)
    .concat(allCh().flatMap(c => c.reads || []).filter(r => (S.reads || {})[r.id]).map(r => r.clip));
  const fixed = C.repairs.filter(r => S.repairs[r.id]).length;
  const gv = (C.gifts || []).filter(x => (S.gifts || []).includes(x.id));
  setMain(`<div class="top"><div id="tube"></div><div><h1>Gamgol Substation</h1><p>Population 412, one goat with a record, and you: 막내 순경, newest officer, eleven days in from the city.</p></div>
      <div class="window" aria-hidden="true"><div class="sun"></div><div class="moon"></div><div class="hill"></div></div></div>
    <div class="savebar" id="savebar"></div>
    ${attCard()}
    <h2 class="listh">Chapters</h2>${jump}
    ${chapters}
    ${finBlock()}
    ${mnAllBlock()}
    <div class="side deskrow">
      ${(() => { const ok = anyClosed && !wait, n = ok ? dueSkills().length : 0, done = (S.brief || {}).day === today();
        return `<button class="note brief" type="button" id="brief" ${ok ? "" : "disabled"}><b>Morning briefing <span class="ko" lang="ko" style="font-size:15px">아침 조회</span></b><span>${!anyClosed ? "Daily review. Opens after your first closed file." : `Daily review of every chapter you have played, so old material does not slip away. 10 questions, about five minutes. ${done ? "Done for today ✓" : n ? `Due today: ${n} topic${n === 1 ? "" : "s"}.` : "Nothing due today; a round keeps your hand in."}`}</span></button>`; })()}
      <button class="note" type="button" id="night" ${anyClosed && !wait ? "" : "disabled"}><b>Night duty <span class="ko" lang="ko" style="font-size:15px">당직</span></b><span>${anyClosed ? `Extra practice on your weak spots. 12 questions from every chapter you have played, mostly on topics you have recently got wrong, plus mistakes sent back for another look. No schedule: play it whenever you like. ${weakSkills(closedChapters()).length ? "Weak spots now: " + weakSkills(closedChapters()).length + "." : "No weak spots at the moment."}` : "Extra practice on your weak spots. Opens after your first closed file."}</span></button>
      <button class="note" type="button" id="upkeep" ${wait ? "disabled" : ""}><b>District upkeep</b><span>Spend the station budget on repairs, one per chapter, each a short work order. ${fixed} of ${C.repairs.length} done${(() => { const nx = C.repairs.find(r => !S.repairs[r.id] && repOpen(r)); return nx ? ` · next: ${esc(nx.name.toLowerCase())}, ${won(nx.cost)}` : ""; })()}. ${(S.gifts || []).length ? (S.gifts || []).length + " gifts given." : ""}</span></button>
    </div>
    <details class="shelf"><summary><h2>Evidence shelf</h2><span>${ev.length + gv.length} item${ev.length + gv.length === 1 ? "" : "s"}</span></summary><div class="plank">${ev.length + gv.length ? ev.map(k => `<div class="ev"><b class="ko" lang="ko">${esc(k.tag)}</b>${esc(k.name)}<em>${esc(k.line)}</em></div>`).join("") + gv.map(x => `<div class="ev gift"><b class="ko" lang="ko">${esc(x.ko)}</b>A present for ${esc(x.to)}<em>${esc(x.line)}</em></div>`).join("") : '<div class="ev empty">Empty. Close a file and something will end up here with a label on it.</div>'}</div></details>
    <div class="movebox"><b>Your progress</b><span>${store.state === "on" ? (store.local ? "Saved on this device automatically." : "Saved to your account automatically.") : store.state === "off" ? "This view cannot save on its own, so a transfer code is the way to keep it." : ""} Back it up, or move it to another device (or between the browser and the phone app), with a transfer code.</span>
      <div class="row"><button class="btn alt sm" type="button" id="mvout">Get a transfer code</button><button class="btn alt sm" type="button" id="mvin">Load from a code</button></div></div>
    <p class="foot">${S.resume ? '<button class="link" id="drop" type="button">Start the half-finished file over</button> · ' : ""}<button class="link" id="reset" type="button">Erase all progress</button></p>${Object.keys(AUD).length ? '<p class="foot" style="margin-top:4px">Korean audio is machine-generated with Supertonic 3 by Supertone Inc. (OpenRAIL-M licence), voices F1 and M1.</p>' : ""}`);
  if ($("#mhall")) $("#mhall").onclick = () => startMnemo(null);
  $("#mvout").onclick = () => backupScreen("out"); $("#mvin").onclick = () => backupScreen("in");
  if ($("#drop")) $("#drop").onclick = () => { delete S.resume; save(); home(); };
  drawSave();
  $$("[data-case]").forEach(b => b.onclick = () => startCase(chById(b.dataset.ch), b.dataset.case));
  $$("[data-vocab]").forEach(b => b.onclick = () => startVocab(chById(b.dataset.vocab)));
  $$("[data-cards]").forEach(b => b.onclick = () => startCards(chById(b.dataset.cards)));
  $$("[data-read]").forEach(b => b.onclick = () => readList(chById(b.dataset.read)));
  $$("[data-mnemo]").forEach(b => b.onclick = () => startMnemo(chById(b.dataset.mnemo)));
  $$(".chead[data-open]").forEach(b => b.onclick = () => { const id = b.dataset.open; const o = openCh(); if (o && o.id === id) { S.openCh = { id: "", done: false }; save(); home(id); } else setOpen(id); });
  $$(".jump [data-open]").forEach(b => b.onclick = () => setOpen(b.dataset.open));
  const att = $(".attbox"); if (att) att.onclick = e => { if (e.target.closest("details")) return; att.classList.toggle("full"); R.attFull = att.classList.contains("full"); };
  if (att && (R.attFull || !window.__game.att().last)) att.classList.add("full");
  if ($("#brief")) $("#brief").onclick = startBrief;
  $("#night").onclick = startNight; if ($("#night2")) $("#night2").onclick = startNight;
  $("#upkeep").onclick = () => { R = { screen: "upkeep" }; drawHeader(); upkeep(null); };
  const rs = $("#reset"); rs.onclick = () => {
    if (rs.dataset.arm) { syReset("erase"); S = fresh(); save(); drawHeader(); return home(); }
    rs.dataset.arm = 1; rs.textContent = "Tap again to erase everything: budget, repairs, files, words"; rs.style.color = "var(--stamp)";
  };
  const jb = $(".jump .on"); if (jb) jb.scrollIntoView({ block: "nearest", inline: "center" });
  if (scrollTo) { const el = $("#chap-" + scrollTo); if (el) el.scrollIntoView({ block: "start" }); }
}

/* ---------------- Transfer codes: back up or move progress between devices ---------------- */
const b64u = bytes => { let s = ""; bytes.forEach(b => s += String.fromCharCode(b)); return btoa(s).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, ""); };
const unb64u = str => { const s = atob(str.replace(/-/g, "+").replace(/_/g, "/")); return Uint8Array.from(s, c => c.charCodeAt(0)); };
async function pipeBytes(bytes, stream) { const r = new Blob([bytes]).stream().pipeThrough(stream); return new Uint8Array(await new Response(r).arrayBuffer()); }
async function makeCode() {
  const json = JSON.stringify({ app: "gamgol", v: 1, at: new Date().toISOString(), s: S }), raw = new TextEncoder().encode(json);
  if (window.CompressionStream) { try { return "GG1." + b64u(await pipeBytes(raw, new CompressionStream("deflate-raw"))); } catch (e) {} }
  return "GG0." + b64u(raw);
}
async function readCode(code) {
  const c = String(code || "").replace(/\s+/g, ""), m = c.match(/^GG([01])\.([A-Za-z0-9_-]+)$/);
  if (!m) throw new Error("That does not look like a Gamgol transfer code. It should start with GG1. and be one long line.");
  if (m[1] === "1" && !window.DecompressionStream) throw new Error("This browser cannot open compressed codes. Try a newer browser.");
  let d;
  try { let bytes = unb64u(m[2]); if (m[1] === "1") bytes = await pipeBytes(bytes, new DecompressionStream("deflate-raw")); d = JSON.parse(new TextDecoder().decode(bytes)); }
  catch (e) { throw new Error("The code is incomplete or damaged. Copy it again, all of it, from GG to the very end."); }
  if (!d || d.app !== "gamgol" || !d.s || typeof d.s !== "object") throw new Error("The code opened, but it is not Gamgol progress.");
  return d;
}
function progressLine(st, at) {
  const cases = Object.keys(st.cases || {}).length, words = Object.values(st.vocab || {}).reduce((n, v) => n + Object.keys(v.w || {}).length, 0);
  return `${cases} file${cases === 1 ? "" : "s"} closed · ${words} words tagged · budget ${won(st.won || 0)}${at ? " · saved " + new Date(at).toLocaleString() : ""}`;
}
async function backupScreen(mode) {
  R = { screen: "backup" }; drawHeader();
  if (mode === "out") {
    setMain(`<div class="card"><p class="place">Transfer code · take your progress with you</p><p class="narr">This code holds everything: closed files, words, cards, budget, repairs and the attendance book. Copy it and keep it somewhere safe as a backup, or paste it into the game on another device.</p>
      <p class="rmeta" style="margin-top:8px">${esc(progressLine(S))}</p><textarea id="code" class="codebox" readonly rows="6">Making the code…</textarea>
      <div class="row" style="margin-top:10px"><button class="btn" id="copy" type="button">Copy the code</button><button class="btn alt" id="hm" type="button">Back to the board</button></div><p class="rnote" id="cmsg" style="margin:8px 0 0"></p></div>`);
    $("#hm").onclick = leave;
    const code = await makeCode(), ta = $("#code"); if (!ta) return; ta.value = code;
    $("#copy").onclick = async () => { let ok = false; try { if (window.AndroidApp && window.AndroidApp.copy) { window.AndroidApp.copy(code); ok = true; } else { await navigator.clipboard.writeText(code); ok = true; } } catch (e) { ta.focus(); ta.select(); try { ok = document.execCommand("copy"); } catch (e2) {} }
      $("#cmsg").textContent = ok ? "Copied. Paste it into a note, a message to yourself, or the game on another device." : "Copying is blocked here. The code is selected: copy it by hand (long-press or Ctrl+C)."; };
    return;
  }
  setMain(`<div class="card"><p class="place">Transfer code · load progress</p><p class="narr">Paste a code from the game on another device, or from your backup. You will see what is in it before anything changes.</p>
    <textarea id="code" class="codebox" rows="6" placeholder="GG1.…" spellcheck="false" autocapitalize="off" autocomplete="off"></textarea>
    <div class="row" style="margin-top:10px"><button class="btn" id="chk" type="button">Check the code</button><button class="btn alt" id="hm" type="button">Back to the board</button></div><div id="res" style="margin-top:10px"></div></div>`);
  $("#hm").onclick = leave;
  $("#chk").onclick = async () => {
    const res = $("#res");
    try {
      const d = await readCode($("#code").value);
      res.innerHTML = `<div class="notice soft"><b>Code is fine.</b> It contains: ${esc(progressLine(d.s, d.at))}.<br>On this device now: ${esc(progressLine(S))}.<br>Loading it <b>replaces</b> the progress on this device.</div>
        <div class="row" style="margin-top:10px"><button class="btn red" id="load" type="button">Replace my progress with this code</button></div>`;
      $("#load").onclick = () => { syReset("load"); S = Object.assign(fresh(), d.s); delete S.resume; migrate(); save(); flush && flush(); drawHeader(); R = { screen: "home" }; home();
        const el = $("#savebar"); if (el) { el.className = "savebar on"; el.innerHTML = "<i></i><span>Progress loaded from the transfer code" + (store.state === "on" ? " and saved to your account." : ".") + "</span>"; } };
    } catch (e) { res.innerHTML = `<div class="notice soft">${esc(e && e.message && e.message.length < 160 ? e.message : "The code could not be read. Check that you copied all of it, from GG to the very end.")}</div>`; }
  };
}

/* ---------------- A case in four phases ---------------- */
const PH = ["Investigation", "Clue analysis", "Phone desk", "District upkeep"];
function caseShell(inner) {
  const cs = R.cs;
  setMain(`<div class="phases">${PH.map((p, i) => `<span class="${i === R.phase ? "on" : i < R.phase ? "done" : ""}">${i + 1}. ${p}</span>`).join("")}</div>
    <div class="casehead"><h2>File ${cs.no} · ${esc(cs.title)}</h2><span id="prog"></span></div>${inner}`);
}
function startCase(ch, id) {
  const cs = ch.cases.find(c => c.id === id), keep = S.resume && S.resume.cs === id ? S.resume : null;
  R = { screen: "case", ch, cs, phase: 0, i: 0, stats: {}, earned: 0, inj: 0, camUsed: false, used: new Set() };
  if (keep) Object.assign(R, { phase: keep.phase, i: keep.i, inj: keep.inj || 0, earned: keep.earned || 0, stats: JSON.parse(JSON.stringify(keep.stats || {})) });
  drawHeader(); R.phase === 2 ? speedIntro() : caseStep();
}
function keepPlace() { // remember where this file stands, so leaving does not lose it
  if (R.screen !== "case" || R.phase > 3) return;
  S.resume = { ch: R.ch.id, cs: R.cs.id, phase: R.phase, i: R.i, inj: R.inj, earned: R.earned, stats: JSON.parse(JSON.stringify(R.stats)) }; save();
}
function caseStep() {
  const { cs, ch } = R; R.part = PH[R.phase]; if (!R.justInjected) keepPlace();
  if (R.phase === 0 || R.phase === 1) {
    const list = R.phase === 0 ? cs.scenes : cs.clues;
    if (R.i >= list.length) {
      if (R.phase === 0) { // reveal the souvenir
        caseShell(`<div class="card"><p class="place">Evidence logged</p><div class="ev" style="margin:8px 0 12px"><b class="ko" lang="ko">${esc(cs.souvenir.tag)}</b>${esc(cs.souvenir.name)}<em>${esc(cs.souvenir.line)}</em></div>
          <p class="narr">It goes on the shelf at the station. Next: the paperwork, where the statements are taken apart quietly, with no goat present.</p>
          <div class="row" style="margin-top:12px"><button class="btn" id="nx" type="button">To the clue analysis</button></div></div>`);
        if (!S.souvenirs.includes(cs.souvenir.id)) { S.souvenirs.push(cs.souvenir.id); save(); }
        $("#nx").onclick = () => { R.phase = 1; R.i = 0; R.inj = 0; R.camUsed = false; caseStep(); }; return;
      }
      R.phase = 2; return speedIntro();
    }
    // a returned item may cut in
    if (R.i >= 2 && R.inj < 2 && !R.justInjected) {
      const rq = nextReopened([ch]);
      if (rq) { R.inj++; R.justInjected = true;
        caseShell(`<p class="place">A form comes back from the tray</p><p class="narr">Something you got wrong earlier has been returned for another look. Different sentence, same point.</p><div id="qb" style="margin-top:10px"></div>`);
        $("#prog").textContent = "returned item"; R.sceneBox = null;
        return ask(rq, $("#qb"), { pay: 1000, alwaysWhy: true }, caseStep);
      }
    }
    R.justInjected = false;
    const it = list[R.i];
    if (R.phase === 0) {
      caseShell(`<div id="scene"><p class="place">${esc(it.place)}</p><p class="narr">${esc(it.narr)}</p>${(it.lines || []).map(l => lineHtml(l, it.q && it.q.enOpts)).join("")}</div><div id="qb" style="margin-top:14px"></div>`);
      R.sceneBox = $("#scene"); wire(R.sceneBox);
      const a = it.after, after = a ? `<div class="after">${(a.lines || []).map(l => lineHtml(l)).join("")}${a.narr ? `<p class="narr" style="margin-top:10px">${esc(a.narr)}</p>` : ""}</div>` : "";
      ask(it.q, $("#qb"), { pay: 1000, after, noFocus: true }, () => { R.i++; caseStep(); });
    } else {
      caseShell(`<p class="place">Back room · statements on the desk</p><div id="qb"></div>`); R.sceneBox = null;
      ask(it, $("#qb"), { pay: 1500, alwaysWhy: true }, () => { R.i++; caseStep(); });
    }
    $("#prog").textContent = (R.phase === 0 ? "scene " : "task ") + (R.i + 1) + " of " + list.length;
    return;
  }
  if (R.phase === 3) return upkeep(ch);
}

/* ---------------- Phone desk: the 60-second round ---------------- */
const SPEED_CALLS = 15, SPEED_BONUS = 50;   // calls in a round; points (and won) per second left when every line is cleared
function speedIntro() {
  R.part = PH[2]; keepPlace();
  const { ch } = R, secs = window.__fast ? 6 : S.repairs.car ? 75 : 60;
  caseShell(`<div class="card"><p class="place">Front desk · every line is ringing</p>
    <p class="narr">The whole village has remembered the station has a telephone. ${SPEED_CALLS} calls are waiting and you have ${secs} seconds. Answer in a row for a combo: three right pays double, six triple, nine four times. A mistake stops the clock while I explain, costs you the combo${S.repairs.coffee ? " (except the first one, thanks to the coffee)" : ""}, and the caller rings back later. Clear every line before the time is up and each second left is paid as ${SPEED_BONUS} points.</p>
    <p>Your record for this chapter: <b>${S.best[ch.id] || 0}</b> points.</p>
    <div class="row" style="margin-top:12px"><button class="btn red" id="st" type="button">Pick up the phone</button></div></div>`);
  $("#st").onclick = () => speedRun(secs);
}
/* A round is a fixed list of different calls. Nothing answered correctly comes back; a call answered
   wrongly goes to the back of the queue and has to be cleared too. */
function speedCalls(ch) {
  const key = q => [q.skill, q.ask, q.ko || "", q.opts[0]].join("|"), seen = new Set(), list = [];
  const weak = S.repairs.bridge ? weakSkills([ch]) : [];
  for (let tries = 0; list.length < SPEED_CALLS && tries < 400; tries++) {
    let q = null, x2 = false;
    if (weak.length && (list.length + 1) % 5 === 0) { q = genBySkill([ch], pick(weak), true); x2 = !!q; }
    q = q || genSpeed(ch); if (!q || seen.has(key(q))) continue;
    seen.add(key(q)); list.push({ q, x2 });
  }
  return list;
}
function speedRun(secs) {
  const { ch } = R, queue = speedCalls(ch), total = queue.length;
  const T = { left: secs * 1000, score: 0, streak: 0, n: 0, right: 0, paused: false, forgiven: !S.repairs.coffee, last: Date.now(), total, bonus: 0 };
  caseShell(`<div class="desk"><div><small>Time</small><b id="tm">${secs}</b></div><div class="x"><small>Combo</small><b id="cb">×1</b></div><div><small>Points</small><b id="sc">0</b></div></div><div class="tbar"><i id="tb" style="width:100%"></i></div><div id="qb"></div>`);
  const mult = () => Math.min(4, 1 + Math.floor(T.streak / 3));
  const hud = () => { $("#tm").textContent = Math.ceil(T.left / 1000); $("#cb").textContent = "×" + mult(); $("#sc").textContent = T.score; $("#tb").style.width = T.left / secs / 10 + "%"; };
  let auto = 0;
  function next() {
    clearTimeout(auto);
    if (!queue.length) {                                   // every line cleared before the time ran out
      stopTimers(); const left = Math.max(0, Math.ceil(T.left / 1000)); T.bonus = left * SPEED_BONUS; T.score += T.bonus; if (T.bonus) earn(T.bonus); T.spare = left; hud(); return speedEnd(T);
    }
    T.n++; const { q, x2 } = queue.shift();
    const order = shuffle(q.opts.map((t, i) => ({ t, i })));
    $("#qb").innerHTML = `<div class="card"><p class="call"><span class="ring">☎</span> Line ${1 + rnd(4)} · <b class="ko" lang="ko">${esc(pick(C.callers))}</b>${x2 ? '<span class="x2">WEAK SPOT ×2</span>' : ""}<span class="left">${queue.length ? queue.length + " more waiting" : "last call"}</span></p>
      <p class="ask" style="margin-bottom:2px">${esc(q.ask)}</p>${q.ko ? `<p class="big ko" lang="ko">${esc(q.ko)}</p>` : ""}
      <div class="opts">${order.map((x, n) => `<button class="opt" type="button" data-i="${x.i}"><i>${"abcd"[n]})</i><span class="${q.enOpts ? "en" : "ko"}">${esc(x.t)}</span></button>`).join("")}</div><div id="sfb"></div></div>`;
    $$("#qb .opt").forEach(b => b.onclick = () => {
      const ok = b.dataset.i === "0"; rec(q.skill, ok, false);
      if (ok) { T.right++; const m = mult() * (x2 ? 2 : 1); T.score += 100 * m; earn((100 + bonus()) * m); T.streak++; hud(); return next(); }
      T.paused = true; $$("#qb .opt").forEach(x => x.disabled = true); b.classList.add("wrong"); $(`#qb .opt[data-i="0"]`).classList.add("right");
      let kept = false; if (!T.forgiven) { T.forgiven = true; kept = true; } else T.streak = 0; hud();
      queue.push({ q, x2: false });                        // the caller rings back later
      const wait = Math.min(8000, Math.max(4500, 3000 + (q.why || "").length * 35));
      $("#sfb").innerHTML = `<div class="fb"><div class="stamp"><span><b>RETURN</b>to sender</span></div><p class="quip">${esc(pick(C.quips.wrong))}</p><p>${esc(q.why)}</p>${kept ? '<p class="notice">The coffee keeps your combo alive. Once. It is coffee, not a miracle.</p>' : ""}<p style="color:var(--ink-soft);font-size:13px">The clock is stopped. This caller will ring back later. The phones start again by themselves.</p><div class="resume"><i id="rs" style="animation-duration:${wait}ms"></i></div><div class="row"><button class="btn" id="bk" type="button">Back to the phones now</button></div></div>`;
      const go = () => { if (!$("#bk")) return; T.paused = false; T.last = Date.now(); next(); window.scrollTo(0, 0); };
      auto = setTimeout(go, wait);
      $("#bk").onclick = go; $("#bk").focus({ preventScroll: true }); $("#sfb").scrollIntoView({ block: "nearest", behavior: "smooth" });
    });
  }
  R.timer = setInterval(() => {
    const now = Date.now(); if (!T.paused) T.left -= now - T.last; T.last = now;
    if (!$("#tm")) { clearTimeout(auto); return stopTimers(); }
    if (T.left <= 0) { clearTimeout(auto); stopTimers(); T.left = 0; hud(); return speedEnd(T); } hud();
  }, 100);
  hud(); next();
}
function speedEnd(T) {
  const { ch } = R, rec0 = S.best[ch.id] || 0, isRec = T.score > rec0;
  if (isRec) { S.best[ch.id] = T.score; save(); }
  const head = T.spare != null ? `Every line cleared with ${T.spare} second${T.spare === 1 ? "" : "s"} to spare${T.bonus ? `: ${T.bonus} bonus points` : ""}.` : `Time is up. ${T.right} of ${T.total} lines cleared.`;
  $("#qb").innerHTML = `<div class="card"><p class="place">The phones go quiet</p><p class="narr">${head} ${T.score} points in all. ${isRec ? "A new station record. The chief will laminate it and bring it up at weddings." : "The record stays at " + rec0 + ". It was never in any danger."}</p>
    <div class="row" style="margin-top:12px"><button class="btn" id="nx" type="button">On to district upkeep</button></div></div>`;
  $("#nx").onclick = () => { R.phase = 3; caseStep(); };
}

/* ---------------- District upkeep: the map and work orders ---------------- */
const SPOTS = { coffee: [72, 108], pa: [214, 66], bridge: [338, 150], cam: [196, 192], car: [84, 296], lamp: [258, 296] };
function mapSvg(sel) {
  const s = id => { const [x, y] = SPOTS[id], r = C.repairs.find(r => r.id === id);
    return `<g class="spot ${S.repairs[id] ? "fixed" : ""} ${sel === id ? "sel" : ""}" data-spot="${id}" tabindex="0" role="button" aria-label="${esc(r.name)}"><circle class="mk" cx="${x}" cy="${y}" r="27" stroke-width="2"/><g transform="translate(${x} ${y}) scale(1.35) translate(${-x} ${-y})">${ICON[id](x, y)}</g><path class="x" d="M${x + 16} ${y - 28}l11 11m0-11l-11 11"/><text x="${x}" y="${y + 49}" text-anchor="middle" lang="ko">${r.ko}</text><text class="cost" x="${x}" y="${y + 66}" text-anchor="middle">${S.repairs[id] ? "✓" : repOpen(r) ? won(r.cost) : "ch. " + r.ch}</text></g>`; };
  return `<svg viewBox="0 0 400 372" role="img" aria-label="Hand-drawn map of the Gamgol district"><defs><filter id="rough"><feTurbulence baseFrequency=".03" numOctaves="2" seed="4"/><feDisplacementMap in="SourceGraphic" scale="4"/></filter></defs>
    <g filter="url(#rough)" fill="none" stroke="#20303a" stroke-linecap="round" stroke-linejoin="round">
      <path d="M-5 300C70 290 150 306 240 294S340 286 405 296" stroke-width="14" stroke="#d9cfae"/><path d="M-5 300C70 290 150 306 240 294S340 286 405 296" stroke-width="1.5" stroke-dasharray="9 9"/>
      <path d="M352 -5C330 50 372 96 340 150S372 250 350 377" stroke="#8fb9cf" stroke-width="20"/><path d="M300 150h78" stroke-width="6" stroke="#8f6638"/>
      <path d="M22 152v-62l50-36 50 36v62z" fill="#cfe0e6" stroke-width="2"/>
      <path d="M172 104l42-34 42 34v8h-84z" fill="#efe2bd" stroke-width="2"/>
      <path d="M146 150h100v88h-100z" stroke-width="1.6" stroke-dasharray="3 6"/>
      <path d="M120 40c8-18 24-18 32 0M286 30c8-18 24-18 32 0M30 226c8-16 22-16 30 0" stroke-width="1.5" stroke="#5f8a63"/>
      <path d="M196 240c0 26 28 30 40 52M96 152c10 60 60 50 80 40" stroke-width="1.5" stroke-dasharray="5 6"/>
    </g>
    <g font-family="Gaegu,cursive" font-size="17" fill="#4f626c"><text x="26" y="44">station</text><text x="250" y="140">square</text><text x="150" y="26">village hall</text><text x="300" y="330">bus stop</text><text x="368" y="60" transform="rotate(80 368 60)">river</text></g>
    ${Object.keys(SPOTS).map(s).join("")}</svg>`;
}
const ICON = {
  car: (x, y) => `<path d="M${x - 13} ${y + 5}v-6l5-7h13l6 7h3v6z" fill="#fff" stroke="#20303a" stroke-width="1.6"/><circle cx="${x - 7}" cy="${y + 6}" r="3" fill="#20303a"/><circle cx="${x + 8}" cy="${y + 6}" r="3" fill="#20303a"/><circle class="live" cx="${x}" cy="${y - 11}" r="3" fill="#bf3626"><animate attributeName="fill" values="#bf3626;#3a77c2;#bf3626" dur="1.2s" repeatCount="indefinite"/></circle>`,
  coffee: (x, y) => `<rect x="${x - 8}" y="${y - 13}" width="16" height="26" rx="2" fill="#fff" stroke="#20303a" stroke-width="1.6"/><rect x="${x - 5}" y="${y - 10}" width="10" height="8" fill="#b7cad2"/><path class="live" d="M${x - 2} ${y - 16}q-3-4 0-7m5 7q-3-4 0-7" stroke="#8f6638" fill="none" stroke-width="1.5"><animate attributeName="opacity" values="1;.2;1" dur="2s" repeatCount="indefinite"/></path>`,
  cam: (x, y) => `<path d="M${x} ${y + 14}v-18" stroke="#20303a" stroke-width="2"/><rect x="${x - 12}" y="${y - 12}" width="18" height="9" fill="#fff" stroke="#20303a" stroke-width="1.6"/><circle class="live" cx="${x + 9}" cy="${y - 8}" r="2.5" fill="#bf3626"><animate attributeName="opacity" values="1;0;1" dur="1.4s" repeatCount="indefinite"/></circle>`,
  pa: (x, y) => `<path d="M${x - 3} ${y + 14}v-14" stroke="#20303a" stroke-width="2"/><path d="M${x - 10} ${y - 4}l12-8v16z" fill="#fff" stroke="#20303a" stroke-width="1.6"/><path class="live" d="M${x + 6} ${y - 9}q5 5 0 10m4-14q9 9 0 18" stroke="#28475b" fill="none" stroke-width="1.5"><animate attributeName="opacity" values="0;1;0" dur="1.6s" repeatCount="indefinite"/></path>`,
  lamp: (x, y) => `<path d="M${x - 4} ${y + 15}v-24q0-6 8-6" stroke="#20303a" stroke-width="2" fill="none"/><circle cx="${x + 6}" cy="${y - 13}" r="4" fill="#fff" stroke="#20303a" stroke-width="1.4"/><circle class="live" cx="${x + 6}" cy="${y - 13}" r="9" fill="#ffd75e" opacity=".6"><animate attributeName="r" values="7;11;7" dur="2.6s" repeatCount="indefinite"/></circle>`,
  bridge: (x, y) => `<path d="M${x - 14} ${y + 4}h28" stroke="#20303a" stroke-width="2.5"/><path class="live" d="M${x - 14} ${y - 7}h28M${x - 12} ${y - 7}v11m8-11v11m8-11v11m8-11v11" stroke="#8f6638" stroke-width="2"/>`,
};
const repOpen = r => r.ch === 1 || S.repairs[r.id] || (chById("ch" + r.ch) || { cases: [] }).cases.some(k => S.cases[k.id]);   // a repair opens with its chapter
const repCh = r => chById("ch" + r.ch) || C.chapters[0];
function upkeep(ch, sel) {
  const inCase = !!ch, gifts = C.gifts || [], G = S.gifts || [];
  const r = sel && C.repairs.find(x => x.id === sel), g = sel && gifts.find(x => x.id === sel);
  const nFixed = C.repairs.filter(x => S.repairs[x.id]).length;
  let info = `<p class="narr">${C.repairs.length - nFixed ? `${C.repairs.length - nFixed} things in the district still need mending, one for each chapter. Pick one on the map or in the list. A repair is a work order: three questions from its chapter, two right to pass. You pay only if you pass.` : "Everything in the district works. The chief has run out of things to point at, and has started pointing at the kitty."}</p>`;
  if (r) { const done = S.repairs[r.id], open = repOpen(r), poor = S.won < r.cost;
    info = `<h3><span class="ko" lang="ko">${r.ko}</span>${esc(r.name)}</h3><p class="rmeta">Chapter ${r.ch} · ${done ? "repaired" : won(r.cost)}</p><p style="margin:6px 0">${esc(r.effect)}</p>
      ${done ? `<p class="narr">${esc(r.done)}</p>` : !open ? `<p class="notice soft">This one opens once you close a file in chapter ${r.ch}.</p>` : poor ? `<p class="notice soft">The budget is ${won(S.won)}. You are ${won(r.cost - S.won)} short.</p>` : `<button class="btn" id="wo" type="button">Start the work order</button>`}`; }
  if (g) { const given = G.includes(g.id), poor = S.won < g.cost;
    info = `<h3><span class="ko" lang="ko">${g.ko}</span>for ${esc(g.to)}</h3><p class="rmeta">${given ? "given" : won(g.cost)}</p>
      ${given ? `<p class="narr">${esc(g.line)}</p>` : poor ? `<p class="notice soft">The budget is ${won(S.won)}. You are ${won(g.cost - S.won)} short.</p>` : `<button class="btn" id="buy" type="button">Buy it for ${won(g.cost)}</button>`}`; }
  const row = x => { const done = S.repairs[x.id], open = repOpen(x);
    return `<button type="button" class="rrow ${done ? "done" : ""} ${open ? "" : "shut"} ${sel === x.id ? "sel" : ""}" data-spot="${x.id}"><span class="rc">${x.ch}</span><span class="rn"><b class="ko" lang="ko">${x.ko}</b><span>${esc(x.name)}</span></span><span class="rp">${done ? "✓" : open ? won(x.cost) : "ch. " + x.ch}</span></button>`; };
  const grow = x => { const given = G.includes(x.id);
    return `<button type="button" class="rrow ${given ? "done" : ""} ${sel === x.id ? "sel" : ""}" data-spot="${x.id}"><span class="rc">♥</span><span class="rn"><b class="ko" lang="ko">${x.ko}</b><span>for ${esc(x.to)}</span></span><span class="rp">${given ? "✓" : won(x.cost)}</span></button>`; };
  const body = `<p class="place">${inCase ? "The district, as drawn by the chief" : "District upkeep · the chief's map"}</p><div class="mapbox">${mapSvg(sel)}</div><div class="card spotinfo" id="spotinfo">${info}</div>
    <details class="rlist" ${r || !sel ? "open" : ""}><summary>Work orders · ${nFixed} of ${C.repairs.length} done</summary><div>${C.repairs.map(row).join("")}</div></details>
    ${gifts.length ? `<details class="rlist" ${g || nFixed === C.repairs.length ? "open" : ""}><summary>The station kitty · ${G.length} of ${gifts.length} gifts given</summary><p class="rnote">Small presents for the village, paid outright from the budget. No paperwork.</p><div>${gifts.map(grow).join("")}</div></details>` : ""}
    <div class="row" style="margin-top:14px">${inCase ? '<button class="btn red" id="close" type="button">Close the file</button>' : '<button class="btn alt" id="back" type="button">Back to the board</button>'}</div>`;
  if (inCase) caseShell(body); else setMain(body);
  if (inCase) $("#prog").textContent = "optional";
  $$(".spot, .rrow").forEach(el => { const go = () => upkeep(ch, el.dataset.spot); el.onclick = go; if (el.tagName !== "BUTTON") el.onkeydown = e => { if (e.key === "Enter" || e.key === " ") go(); }; });
  if ($("#wo")) $("#wo").onclick = () => workOrder(ch, r, [repCh(r)]);
  if ($("#buy")) $("#buy").onclick = () => { if (S.won < g.cost || G.includes(g.id)) return; S.won -= g.cost; (S.gifts || (S.gifts = [])).push(g.id); save(); drawHeader(); upkeep(ch, g.id); };
  if ($("#close")) $("#close").onclick = summary;
  if ($("#back")) $("#back").onclick = leave;
  if (sel) $("#spotinfo").scrollIntoView({ block: "nearest" });
}
function workOrder(ch, r, chs) {
  let i = 0, right = 0; const prevPhase = R.phase; R.phase = null; R.used = R.used || new Set();
  const frame = () => { const h = `<p class="place">Work order · ${esc(r.name)} · question ${i + 1} of 3 · ${right} right</p><div id="qb"></div>`; ch ? caseShell(h) : setMain(h); if (ch) { $$(".phases span")[3].classList.add("on"); $("#prog").textContent = ""; } };
  const step = () => {
    if (i === 3 || right === 2 || i - right === 2) {
      const pass = right >= 2; if (pass) { S.won -= r.cost; S.repairs[r.id] = true; save(); drawHeader(); }
      const h = `<div class="card"><p class="place">Work order ${pass ? "signed off" : "rejected"}</p><p class="narr">${pass ? esc(r.done) + " " + won(r.cost) + " leaves the budget." : "Two wrong. The form is refused, which costs you nothing except dignity. You may try again at once, with different questions, if you can bear it."}</p>
        <div class="row" style="margin-top:12px">${pass ? "" : '<button class="btn" id="again" type="button">Try again</button>'}<button class="btn alt" id="mp" type="button">Back to the map</button></div></div>`;
      R.phase = prevPhase; ch ? caseShell(h) : setMain(h);
      if ($("#again")) $("#again").onclick = () => workOrder(ch, r, chs);
      $("#mp").onclick = () => upkeep(ch, r.id); return;
    }
    frame(); const q = genMixed(chs, true);
    ask(q, $("#qb"), { alwaysWhy: true }, res => { i++; if (res.ok) right++; step(); });
  };
  step();
}

/* ---------------- Case summary ---------------- */
function skillSummary(stats) { // one block per part of the round: investigation, clue analysis, phone desk, upkeep
  const parts = Object.keys(stats).filter(p => Object.keys(stats[p]).length); if (!parts.length) return "";
  return parts.map(p => `${parts.length > 1 || p !== "Round" ? `<h3 class="sumh">${esc(p)}</h3>` : ""}<div class="sum">${Object.keys(stats[p]).map(id => { const t = stats[p][id], k = C.skills[id], bad = t.w > 0;
    return `<div class="${bad ? "rev" : ""}"><b>${esc(k.name)} · ${t.r} of ${t.r + t.w}</b>${bad ? "Review: " + esc(k.rule) : "Solid."}</div>`; }).join("")}</div>`).join("");
}
function summary() {
  const { cs, ch } = R, first = !S.cases[cs.id], idx = ch.cases.indexOf(cs);
  S.cases[cs.id] = { closed: true }; delete S.resume; if (first) earn(5000); save();
  const allCases = allCh().flatMap(c => c.cases.map(k => ({ c, k }))), pos = allCases.findIndex(x => x.k === cs), nx = ch.cases[idx + 1] ? { c: ch, k: ch.cases[idx + 1] } : allCases[pos + 1];
  R.phase = 4;
  caseShell(`<div class="card"><p class="place">File closed</p><div class="stamp ok" style="top:10px;right:10px"><span><b>CLOSED</b>${cs.no}</span></div>
    <p class="narr" style="margin-right:84px">${first ? "Closing bonus " + won(5000) + ". " : ""}This file brought in ${won(R.earned)}. The budget stands at ${won(S.won)}.</p>
    ${skillSummary(R.stats)}
    <div class="row" style="margin-top:12px">${nx ? `<button class="btn" id="nx" type="button">Next file: ${esc(nx.k.title)}</button>` : ""}<button class="btn alt" id="nd" type="button">Night duty on weak spots</button><button class="btn alt" id="hm" type="button">Back to the board</button></div></div>`);
  if (nx) $("#nx").onclick = () => startCase(nx.c, nx.k.id);
  $("#nd").onclick = startNight; $("#hm").onclick = leave;
}

/* ---------------- Night duty ---------------- */
function startNight() {
  const chs = closedChapters(); if (!chs.length) return;
  R = { screen: "night", stats: {}, earned: 0, i: 0, used: new Set(), phase: 0, camUsed: false }; drawHeader();
  const N = 12;
  const step = () => {
    if (R.i >= N) { setMain(`<div class="card"><p class="place">Night duty · 06:00</p><p class="narr">The sun comes up over the persimmon trees. Nobody called. Nobody ever does. You earned ${won(R.earned)} for remaining conscious, which is the job.</p>${skillSummary(R.stats)}<div class="row" style="margin-top:12px"><button class="btn" id="ag" type="button">Another night</button><button class="btn alt" id="hm" type="button">Back to the board</button></div></div>`);
      $("#ag").onclick = startNight; $("#hm").onclick = leave; return; }
    const rq = R.i % 3 === 1 ? nextReopened(chs) : null, q = rq || genMixed(chs, true);
    setMain(`<div class="casehead"><h2>Night duty <span class="ko" lang="ko" style="font-size:16px">당직</span></h2><span>${R.i + 1} of ${N}</span></div><p class="narr" style="margin-bottom:10px">${R.i === 0 ? "Midnight. The strip light hums. The desk drawer is full of everything you have got wrong so far. It is a deep drawer." : ""}</p><div id="qb"></div>`);
    R.sceneBox = null; ask(q, $("#qb"), { pay: 800, alwaysWhy: true }, () => { R.i++; step(); });
  };
  step();
}

/* ---------------- Lost & found: the word game ---------------- */
function headForms(ch, w, key) { // wrong forms for a vocabulary phrase, built from the checked verb table
  if (w.fw) return w.fw[key];
  if (ch.forms[0].key !== "ms") return null;
  const parts = w.ko.split(" "), head = parts.pop(), pre = parts.length ? parts.join(" ") + " " : "", tail = key === 1 ? " 해요" : "";
  if (head.endsWith("하다")) { const s = head.slice(0, -2); return (key === 0 ? [s + "하으면서", s + "할면서", s + "할으면서"] : [s + "하을까", s + "할을까", s + "하까"]).map(x => pre + x + tail); }
  const v = ch.verbs.find(x => x.d === head); if (!v) return null;
  return (key === 0 ? v.mw : v.lw || []).map(x => pre + x + tail);
}
function wordQ(ch, idx, type) {
  const w = ch.vocab[idx];
  if (type === "m") return genVocab(ch, "m", w);
  if (type === "r") return genVocab(ch, "r", w);
  if (type === "f") { const key = rnd(2), wrong = headForms(ch, w, key);
    return { type: "mc", skill: ch.forms[key].skill, ask: "Put it into the " + ch.forms[key].label + " form.", ko: w.ko + " → ___", sub: w.en, opts: [w.f[key], ...wrong], why: "The last verb carries the ending: " + w.f[key] + "." }; }
  if (type === "c") { const c = ch.colloc.find(c => (c.particle ? c.stem + c.a + " " + c.tail : c.stem + " " + c.a) === w.ko); return genColloc(ch, c); }
  return { type: "write", spell: true, skill: ch.vocSkill || "voc", ask: "Spell the Korean for: " + w.en, accept: [w.ko, ...(w.alt || [])], hint: [], why: "It is spelled " + w.ko + "." };
}
function wordTypes(ch, idx) {
  const w = ch.vocab[idx], t = ["m", "r"];
  if (w.f && headForms(ch, w, 0) && headForms(ch, w, 1) && headForms(ch, w, 1).length === 3) t.push("f");
  if (ch.colloc.some(c => (c.particle ? c.stem + c.a + " " + c.tail : c.stem + " " + c.a) === w.ko)) t.push("c");
  return t;
}
function startVocab(ch) {
  const V = S.vocab[ch.id] || (S.vocab[ch.id] = { order: [], ptr: 0, w: {} });
  const round = [];
  while (round.length < Math.min(10, ch.vocab.length)) { // every word comes up before any repeats, across visits
    if (V.ptr >= V.order.length) { V.order = shuffle(ch.vocab.map((_, i) => i)); V.ptr = 0; }
    const i = V.order[V.ptr++]; if (i < ch.vocab.length && !round.includes(i)) round.push(i);
  }
  save();
  R = { screen: "vocab", stats: {}, earned: 0, i: 0, used: new Set(), phase: 0, camUsed: false }; drawHeader();
  const step = () => {
    const st = vstat(ch);
    const tags = `<div class="lost">${round.map((i, n) => { const t = V.w[i] || {}; return `<span class="${vGold(ch, i, t) ? "g" : vKinds(t) >= 2 ? "f" : ""}" lang="ko">${n < R.i ? esc(ch.vocab[i].ko) : "?"}</span>`; }).join("")}</div>`;
    if (R.i >= round.length) { setMain(`<div class="card"><p class="place">Lost &amp; found · shelf tidied</p><p class="narr">Ten items tagged. ${st.f + st.g} of ${st.n} words are filed, ${st.g} of them gold. You earned ${won(R.earned)}.</p>${tags}
      <p style="font-size:13px;color:var(--ink-soft);margin-top:10px">Green: answered right in two different kinds of question. Gold: right in every kind, and twice more after that.</p>
      <div class="row" style="margin-top:12px"><button class="btn" id="ag" type="button">Next ten</button><button class="btn alt" id="hm" type="button">Back to the board</button></div></div>`);
      $("#ag").onclick = () => startVocab(ch); $("#hm").onclick = leave; return; }
    const idx = round[R.i], done = V.w[idx] || {}, types = wordTypes(ch, idx);
    const seq = types;                                 // meaning, into Korean, form, partner: always a choice, never typing
    const type = seq.find(t => !done[t]) || pick(seq);
    const q = wordQ(ch, idx, type);
    setMain(`<div class="casehead"><h2>Lost &amp; found</h2><span>item ${R.i + 1} of ${round.length}</span></div><p class="narr" style="margin-bottom:10px">${R.i === 0 ? "A shelf of things people left on the bus and have not missed. Each has a tag. The tags are your job. It is not glamorous." : ""}</p><div id="qb"></div>${tags}`);
    R.sceneBox = null;
    ask(q, $("#qb"), { pay: 500, alwaysWhy: true }, res => { if (res.ok) { const t = V.w[idx] || (V.w[idx] = {}); t[type] = 1; t.n = (t.n || 0) + 1; save(); } R.i++; step(); });
  };
  step();
}

/* ---------------- Card index: flashcards, both directions, self-rated ---------------- */
function deck(ch) {                     // vocabulary plus collocations; ids stay stable when content grows
  if (ch._deck) return ch._deck;
  const lines = ch.cases.flatMap(cs => [...cs.scenes.flatMap(sc => [...(sc.lines || []), ...((sc.after && sc.after.lines) || [])].map(l => l.ko).concat(sc.q && sc.q.ko && !/___/.test(sc.q.ko) ? [sc.q.ko] : []))].map(ko => ({ ko, no: cs.no })));
  const seen = w => { const last = w.ko.split(" ").pop(), key = /다$/.test(last) && w.pos !== "n" ? (last.length > 2 ? last.slice(0, -1) : null) : w.ko; return key && lines.find(l => l.ko && l.ko.includes(key)) || null; };
  const ex = ko => { const e = ch.cardEx && ch.cardEx[ko]; return e ? { ko: e[0], en: e[1], no: e[2] } : null; };
  const d = ch.vocab.map(w => ({ id: "v:" + w.ko, ko: w.ko, en: w.en, kind: "word", seen: ex(w.ko) || (ch.cardEx ? null : seen(w)) }));
  (ch.colloc || []).forEach(c => { if (c.particle || !c.a || !c.stem) return; const ko = c.stem + " " + c.a; if (!d.some(x => x.ko === ko)) d.push({ id: "c:" + ko, ko, en: c.en, kind: "phrase", seen: ex(ko) }); });
  return ch._deck = d;
}
function cardsOf(ch) { const A = S.cards || (S.cards = {}); return A[ch.id] || (A[ch.id] = { b: {}, t: {}, r: 0 }); }
function cstat(ch) { const D = deck(ch), K = (S.cards || {})[ch.id] || { b: {} }, b = [0, 0, 0]; D.forEach(c => b[K.b[c.id] || 0]++); return { n: D.length, b }; }
const BOX = [["open", "Still open", "didn't know it"], ["pend", "Pending", "not sure"], ["shut", "Closed", "knew it"]];
function startCards(ch) {
  const D = deck(ch), K = cardsOf(ch); K.r++;
  const due = c => { const b = K.b[c.id] || 0, age = K.r - (K.t[c.id] || -9); return b === 0 ? 3 : b === 1 ? (age > 1 ? 2 : 0) : (age > 3 ? 1 : 0); };
  const round = shuffle(D.slice()).sort((x, y) => due(y) - due(x)).slice(0, Math.min(10, D.length));
  const dirs = shuffle(round.map((_, i) => i % 2 === 0));        // true: Korean first. Half and half, in random order
  R = { screen: "cards", i: 0, tally: [0, 0, 0] }; drawHeader();
  const step = () => {
    if (R.screen !== "cards") return;
    if (R.i >= round.length) {
      const st = cstat(ch), t = R.tally;
      const line = t[2] === round.length ? "All ten closed. The drawer shuts without complaint, which is unusual for this drawer." : t[0] === 0 ? "Nothing left open. A few are pending, which in this station counts as progress." : t[0] >= 7 ? "Most of them are still at large. They will be back, and so, one assumes, will you." : `${t[2]} closed, ${t[1]} pending, ${t[0]} still at large. The open ones go to the front of the drawer.`;
      setMain(`<div class="card"><p class="place">Card index · ${esc(ch.sub)}</p><p class="narr">${line}</p>
        <div class="boxes">${BOX.map((x, k) => `<div class="${x[0]}"><b>${st.b[k]}</b><span>${k ? x[1] : "Open or new"}</span></div>`).join("")}</div>
        <p style="font-size:13px;color:var(--ink-soft);margin-top:10px">Whole drawer: ${st.n} cards. Open cards come back first, pending ones after a round, closed ones now and then.</p>
        <div class="row" style="margin-top:12px"><button class="btn" id="ag" type="button">Next ten</button><button class="btn alt" id="hm" type="button">Back to the board</button></div></div>`);
      $("#ag").onclick = () => startCards(ch); $("#hm").onclick = leave; return;
    }
    const c = round[R.i], koFirst = dirs[R.i], was = K.b[c.id];
    const face = (ko, back) => ko ? `<span class="ko big" lang="ko">${esc(c.ko)}</span>${ttsBtn(c.ko, VOICE_F, true)}` : `<span class="en big">${esc(c.en)}</span>`;
    setMain(`<div class="casehead"><h2>Card index</h2><span>card ${R.i + 1} of ${round.length}</span></div>
      ${R.i === 0 ? '<p class="narr" style="margin-bottom:10px">A drawer of index cards, kept by someone with strong views on filing. Read the card, say the other side to yourself, then turn it over and be honest.</p>' : ""}
      <button class="fcard" id="fc" type="button" aria-label="Turn the card over">
        <span class="fhead"><span>${c.kind === "phrase" ? "PHRASE" : "WORD"} · ${koFirst ? "Korean → English" : "English → Korean"}</span><span>${was === undefined ? "new" : BOX[was][1].toLowerCase()}</span></span>
        <span class="fq">${face(koFirst)}</span>
        <span class="fa" id="fa" hidden><span class="rule"></span>${face(!koFirst)}${c.seen ? `<span class="seen"><i>${c.seen.no ? "Seen in file " + esc(c.seen.no) : "From the station log"}</i><span class="ko" lang="ko">${esc(c.seen.ko)} ${ttsBtn(c.seen.ko, VOICE_F, true)}</span>${c.seen.en ? `<em>${esc(c.seen.en)}</em>` : ""}</span>` : ""}</span>
        <span class="fhint" id="fh">Tap to turn over</span></button>
      <div class="rate" id="rate" hidden>${BOX.map((x, k) => `<button class="rb ${x[0]}" type="button" data-b="${k}"><b>${x[1]}</b><span>${x[2]}</span></button>`).join("")}</div>`);
    wire($("#main"));
    const flip = () => { $("#fa").hidden = false; $("#fh").hidden = true; $("#rate").hidden = false; $("#fc").classList.add("on"); };
    $("#fc").onclick = flip;
    $$(".rb").forEach(b => b.onclick = () => { const k = +b.dataset.b; K.b[c.id] = k; K.t[c.id] = K.r; R.tally[k]++; R.i++; stampDay(); save(); step(); });
  };
  step();
}
document.addEventListener("keydown", e => {
  if (R.screen !== "cards" || !$("#fc")) return;
  if ($("#rate").hidden) { if (e.key === " " || e.key === "Enter") { e.preventDefault(); $("#fc").click(); } }
  else if ("123".includes(e.key) && e.key) { const b = $$(".rb")[+e.key - 1]; if (b) b.click(); }
});

/* ---------------- Village newsletter: short columns to read ---------------- */
const READ_PAY = 150;
function readList(ch) {
  R = { screen: "read" }; drawHeader();
  const done = S.reads || {};
  setMain(`<div class="casehead"><h2>Village newsletter</h2><span>${esc(ch.sub)}</span></div>
    <p class="narr">The village newsletter comes out when 이장님 has something to say, which is weekly. It has a column. Read it in Korean, then answer three questions. Tap a dotted word for its meaning.</p>
    <div class="rlist" style="margin-top:14px">${ch.reads.map((r, i) => `<button class="rrow" type="button" data-r="${i}"><span class="rc">${i + 1}</span>
      <span class="rn"><b class="ko" lang="ko">${esc(r.title)}</b><span>${esc(r.byEn)}</span></span><span class="rp">${done[r.id] ? done[r.id].best + " of " + r.qs.length : "unread"}</span></button>`).join("")}</div>
    <div class="row" style="margin-top:14px"><button class="btn alt" id="hm" type="button">Back to the board</button></div>`);
  $$("[data-r]").forEach(b => b.onclick = () => readCol(ch, +b.dataset.r));
  $("#hm").onclick = leave;
}
function readText(r, withEn) {
  const line = t => esc(t).replace(/(\S*)\{([^|}]+)\|([^}]+)\}(\S*)/g, (m, a, w, l, b) => `<span class="nw">${a}<button class="gl" type="button" data-g="${l}">${w}</button>${b}</span>`);
  return `<article class="news"><p class="mast"><span class="ko" lang="ko">감골 마을 소식</span><span>${r.text.some(t => hasRec(readVoice(r, t), t[0])) ? `<button class="tts rec rplay" id="rplay" type="button" aria-label="Listen to the column">${SPK}</button>` : '<button class="tts rplay" id="rplay" type="button" aria-label="Listen to the column">' + SPK + "</button>"}column</span></p><h3 class="ko" lang="ko">${esc(r.title)}</h3><p class="by ko" lang="ko">${esc(r.by)}</p>
    ${withEn ? `<div class="ntr">${r.text.map(t => `<p><span class="ko" lang="ko">${t[2] ? `<b>${esc(t[2])}:</b> ` : ""}${line(t[0])}</span><em>${esc(t[1])}</em></p>`).join("")}</div>`
      : r.chat ? `<div class="nchat">${r.text.map(t => `<p class="${t[2] === "나" ? "me" : ""}"><b class="ko" lang="ko">${esc(t[2])}</b><span class="ko" lang="ko">${line(t[0])}</span></p>`).join("")}</div>`
      : `<p class="ntext ko" lang="ko">${r.text.map(t => line(t[0])).join(" ")}</p>`}
    <p class="glbar" id="glbar" hidden></p></article>`;
}
function bindGloss(r) {
  const rp = $("#rplay"); if (rp) rp.onclick = () => sayAll(r.text.map(t => [readVoice(r, t), t[0]]), rp);
  $$(".gl").forEach(b => b.onclick = () => { const g = $("#glbar"); $$(".gl.on").forEach(x => x !== b && x.classList.remove("on"));
    const on = b.classList.toggle("on"); g.hidden = !on; if (on) g.innerHTML = `<b class="ko" lang="ko">${esc(b.dataset.g)}</b> ${esc(r.gloss[b.dataset.g] || "")}`; });
}
function readCol(ch, idx) {
  const r = ch.reads[idx], first = !(S.reads || {})[r.id];
  R = { screen: "read", i: 0, right: 0 }; drawHeader();
  const order = r.qs.map(q => shuffle(q.opts.map((o, k) => ({ o, ok: k === 0 }))));
  const step = () => {
    if (R.screen !== "read") return;
    if (R.i >= r.qs.length) return readEnd(ch, idx, first);
    const q = r.qs[R.i], opts = order[R.i];
    setMain(`<div class="casehead"><h2>Village newsletter</h2><span>question ${R.i + 1} of ${r.qs.length}</span></div>
      ${R.i === 0 ? `<p class="narr" style="margin-bottom:10px">${esc(r.intro)}</p>` : ""}
      ${readText(r, false)}
      <div class="card" style="margin-top:14px"><p class="ask">${esc(q.ask)}</p>
      <div class="opts">${opts.map((x, k) => `<button class="opt" type="button" data-k="${k}"><i>${"abcd"[k]})</i><span class="en">${esc(x.o)}</span></button>`).join("")}</div><div id="rfb"></div></div>`);
    window.scrollTo(0, 0); bindGloss(r);
    $$(".opt").forEach(b => b.onclick = () => {
      const k = +b.dataset.k, ok = opts[k].ok; if (ok) R.right++; stampDay(); save();
      $$(".opt").forEach((x, j) => { x.disabled = true; if (opts[j].ok) x.classList.add("right"); else if (j === k) x.classList.add("wrong"); });
      $("#rfb").innerHTML = `<div class="fb">${ok ? '<div class="stamp ok"><span><b>FILED</b>news desk</span></div>' : '<div class="stamp"><span><b>RETURN</b>to sender</span></div>'}
        <p class="quip">${esc(pick(ok ? C.quips.right : C.quips.wrong))}</p><p>${esc(q.why)}</p><div class="row after"><button class="btn" id="nx" type="button">${R.i + 1 < r.qs.length ? "Next question" : "Finish"}</button></div></div>`;
      $("#nx").onclick = () => { R.i++; step(); }; $("#nx").focus({ preventScroll: true });
    });
  };
  step();
}
function readEnd(ch, idx, first) {
  const r = ch.reads[idx], n = r.qs.length, A = S.reads || (S.reads = {}), pay = first ? R.right * READ_PAY : 0;
  A[r.id] = { best: Math.max(R.right, (A[r.id] || {}).best || 0), at: Date.now() };
  if (pay) S.won += pay; save(); drawHeader();
  const line = R.right === n ? "All three. The editor has been informed and has said nothing, which is how the editor praises people." : R.right === 0 ? "None of the three. The column will be here tomorrow. So, regrettably, will the goat." : `${R.right} of ${n}. The column is not going anywhere. Neither, it seems, is anyone in it.`;
  setMain(`<div class="casehead"><h2>Village newsletter</h2><span>${R.right} of ${n}</span></div>
    <p class="narr">${line} ${pay ? "The station is paid " + won(pay) + " for reading carefully." : first ? "" : "A second reading is free of charge and, sadly, of payment."}</p>
    ${first ? `<div class="ev" style="margin:12px 0"><b class="ko" lang="ko">${esc(r.clip.tag)}</b>${esc(r.clip.name)}<em>${esc(r.clip.line)}</em></div>` : ""}
    <p class="place" style="margin-top:14px">The whole column, sentence by sentence</p>
    ${readText(r, true)}
    <div class="row" style="margin-top:14px">${idx + 1 < ch.reads.length ? '<button class="btn" id="nc" type="button">Next column</button>' : ""}<button class="btn alt" id="ls" type="button">All columns</button><button class="btn alt" id="hm" type="button">Back to the board</button></div>`);
  bindGloss(r);
  if ($("#nc")) $("#nc").onclick = () => readCol(ch, idx + 1);
  $("#ls").onclick = () => readList(ch); $("#hm").onclick = leave;
}

window.__appBack = () => { if (R.screen === "home" || R.screen === "load") return false; leave(); return true; };   // the phone's back button: to the board first, then out
/* ---------------- Start ---------------- */
window.__game = { startMnemo, mnRate, mnQueue, mnParticle, MN, startCase, startCards, audioList, audioKey, sayAll, AUD, speedCalls, readList, readCol, ask, makeCode, readCode, backupScreen, startBrief, dueSkills, schedule, openCh, currentCh, setOpen, deck, cstat, stampDay, att, buildTiles, reorderOK, wordUnits, lookalikes, get S() { return S; }, set S(v) { S = v; }, judge, expand, genForm, genVocab, genColloc, genSpeed, headForms, wordTypes, C, home, drawHeader, store };
oskInit();
try { findVoice(); speechSynthesis.onvoiceschanged = findVoice; } catch (e) {}
boot();
})();
