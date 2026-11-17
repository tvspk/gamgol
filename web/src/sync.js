/* ---------------- Sync between devices: phone ↔ tablet ↔ computer through a private GitHub repository ----------------
   Inserted into the engine by build.sh (same function scope as the game, so it can wrap save / home / boot and use S, R, store).
   Runs only where progress lives in this device's storage AND the page says window.GG_LOCAL (the APK and the web on
   GitHub Pages). In the claude.ai artifact nothing here runs and the board has no Sync button.
   Mailbox = a PRIVATE repository (default gamgol-sync). In main only SY_META ({app, sync:1, created, check}); check proves the
   pairing code. Each device has its own branch gg-<12 hex> with one file "state" (a commit without parents, force-pushed, the
   history does not grow). "state" = [IV 12 B][AES-256-GCM(gzip(JSON))], AAD 'state', key HKDF-SHA-256 from the 8 words
   (salt 'Gamgol sync v1', info 'state'). Protocol as in MemoChat, Zelvi sudoku and Gorsaf (tvspk).
   Merging (syMerge), rules agreed with the user (README, "Sync"):
   - COUNTERS are summed: the budget (won, earned AND spent: a device's contribution can be negative), the answer count S.n,
     right/wrong per grammar skill. Each device uploads only its own contribution own = state − sum of the others'
     contributions at the last merge (SY.dev); state = own + new sum of the others. The progress and SY are therefore
     always written together (syPersist).
   - UNION: closed files, souvenirs, repairs, gifts, newsletter columns (best score), Lost & found tags per word (OR, n = max),
     card rounds per chapter (max). MAXIMUM: best speed round per chapter, the last morning briefing day.
     Attendance book: the later stamped day wins (then the longer run), best = max, marks hit = union.
   - LAST CHANGED WINS, per item: every skill's state (run of right answers, weak, sent back for another look), the review
     schedule of every skill (rv), every flashcard's box, every Mnemo Hooks card direction (mh.c), the half-finished file and
     the unfolded chapter. The time of a change is taken when save() sees it (syTouch), on GitHub's clock (skew) and always
     later than anything this device has already seen for that item (logical clock against wrong device clocks). Items never
     filled in have weight 0 and never overwrite a filled one.
   - NOT synced (this device only): light/dark look, on-screen keyboard, typing vs tiles, the deal order of Lost & found.
   Token and the 8 words are only in localStorage 'gamgol-sync' of this device, never in a transfer code. */
var SY = null, syKey = null, syBusy = false, syAgain = false, sySoonT = null, syFp = "", sySoonAt = 0, syResetNote = "";
const SY_KEY = "gamgol-sync", SY_API = "https://api.github.com", SY_META = "gamgol-sync.json", SY_APP = "Gamgol", SY_DEFREPO = "gamgol-sync";
const SY_RE_REPO = /^[A-Za-z0-9-]{1,39}\/[A-Za-z0-9._-]{1,100}$/, SY_RE_BR = /^gg-[a-f0-9]{12}$/, SY_SHA = /^[a-f0-9]{40}$/, SY_DAY = /^\d{4}-\d{2}-\d{2}$/;
const SY_POLL = 60000, SY_SOON = 15000, SY_HOME = 3000, SY_BACK = 20000, SY_ERRWAIT = 5 * 60000, SY_RETRY = 30 * 60000, SY_HARD = ["token", "notfound", "forbidden", "public", "meta"];
const SY_WORDS = "abandon ability able about above absent absorb abstract absurd abuse access accident account accuse achieve acid acoustic acquire across act action actor actress actual adapt add addict address adjust admit adult advance advice aerobic affair afford afraid again age agent agree ahead aim air airport aisle alarm album alcohol alert alien all alley allow almost alone alpha already also alter always amateur amazing among amount amused analyst anchor ancient anger angle angry animal ankle announce annual another answer antenna antique anxiety any apart apology appear apple approve april arch arctic area arena argue arm armed armor army around arrange arrest arrive arrow art artefact artist artwork ask aspect assault asset assist assume asthma athlete atom attack attend attitude attract auction audit august aunt author auto autumn average avocado avoid awake aware away awesome awful awkward axis baby bachelor bacon badge bag balance balcony ball bamboo banana banner bar barely bargain barrel base basic basket battle beach bean beauty because become beef before begin behave behind believe below belt bench benefit best betray better between beyond bicycle bid bike bind biology bird birth bitter black blade blame blanket blast bleak bless blind blood blossom blouse blue blur blush board boat body boil bomb bone bonus book boost border boring borrow boss bottom bounce box boy bracket brain brand brass brave bread breeze brick bridge brief bright bring brisk broccoli broken bronze broom brother brown brush bubble buddy budget buffalo build bulb bulk bullet bundle bunker burden burger burst bus business busy butter buyer buzz cabbage cabin cable cactus cage cake call calm camera camp can canal cancel candy cannon canoe canvas canyon capable capital captain car carbon card cargo carpet carry cart case cash casino castle casual cat catalog catch category cattle caught cause caution cave ceiling celery cement census century cereal certain chair chalk champion change chaos chapter charge chase chat cheap check cheese chef cherry chest chicken chief child chimney choice choose chronic chuckle chunk churn cigar cinnamon circle citizen city civil claim clap clarify claw clay clean clerk clever click client cliff climb clinic clip clock clog close cloth cloud clown club clump cluster clutch coach coast coconut code coffee coil coin collect color column combine come comfort comic common company concert conduct confirm congress connect consider control convince cook cool copper copy coral core corn correct cost cotton couch country couple course cousin cover coyote crack cradle craft cram crane crash crater crawl crazy cream credit creek crew cricket crime crisp critic crop cross crouch crowd crucial cruel cruise crumble crunch crush cry crystal cube culture cup cupboard curious current curtain curve cushion custom cute cycle dad damage damp dance danger daring dash daughter dawn day deal debate debris decade december decide decline decorate decrease deer defense define defy degree delay deliver demand demise denial dentist deny depart depend deposit depth deputy derive describe desert design desk despair destroy detail detect develop device devote diagram dial diamond diary dice diesel diet differ digital dignity dilemma dinner dinosaur direct dirt disagree discover disease dish dismiss disorder display distance divert divide divorce dizzy doctor document dog doll dolphin domain donate donkey donor door dose double dove draft dragon drama drastic draw dream dress drift drill drink drip drive drop drum dry duck dumb dune during dust dutch duty dwarf dynamic eager eagle early earn earth easily east easy echo ecology economy edge edit educate effort egg eight either elbow elder electric elegant element elephant elevator elite else embark embody embrace emerge emotion employ empower empty enable enact end endless endorse enemy energy enforce engage engine enhance enjoy enlist enough enrich enroll ensure enter entire entry envelope episode equal equip era erase erode erosion error erupt escape essay essence estate eternal ethics evidence evil evoke evolve exact example excess exchange excite exclude excuse execute exercise exhaust exhibit exile exist exit exotic expand expect expire explain expose express extend extra eye eyebrow fabric face faculty fade faint faith fall false fame family famous fan fancy fantasy farm fashion fat fatal father fatigue fault favorite feature february federal fee feed feel female fence festival fetch fever few fiber fiction field figure file film filter final find fine finger finish fire firm first fiscal fish fit fitness fix flag flame flash flat flavor flee flight flip float flock floor flower fluid flush fly foam focus fog foil fold follow food foot force forest forget fork fortune forum forward fossil foster found fox fragile frame frequent fresh friend fringe frog front frost frown frozen fruit fuel fun funny furnace fury future gadget gain galaxy gallery game gap garage garbage garden garlic garment gas gasp gate gather gauge gaze general genius genre gentle genuine gesture ghost giant gift giggle ginger giraffe girl give glad glance glare glass glide glimpse globe gloom glory glove glow glue goat goddess gold good goose gorilla gospel gossip govern gown grab grace grain grant grape grass gravity great green grid grief grit grocery group grow grunt guard guess guide guilt guitar gun gym habit hair half hammer hamster hand happy harbor hard harsh harvest hat have hawk hazard head health heart heavy hedgehog height hello helmet help hen hero hidden high hill hint hip hire history hobby hockey hold hole holiday hollow home honey hood hope horn horror horse hospital host hotel hour hover hub huge human humble humor hundred hungry hunt hurdle hurry hurt husband hybrid ice icon idea identify idle ignore ill illegal illness image imitate immense immune impact impose improve impulse inch include income increase index indicate indoor industry infant inflict inform inhale inherit initial inject injury inmate inner innocent input inquiry insane insect inside inspire install intact interest into invest invite involve iron island isolate issue item ivory jacket jaguar jar jazz jealous jeans jelly jewel job join joke journey joy judge juice jump jungle junior junk just kangaroo keen keep ketchup key kick kid kidney kind kingdom kiss kit kitchen kite kitten kiwi knee knife knock know lab label labor ladder lady lake lamp language laptop large later latin laugh laundry lava law lawn lawsuit layer lazy leader leaf learn leave lecture left leg legal legend leisure lemon lend length lens leopard lesson letter level liar liberty library license life lift light like limb limit link lion liquid list little live lizard load loan lobster local lock logic lonely long loop lottery loud lounge love loyal lucky luggage lumber lunar lunch luxury lyrics machine mad magic magnet maid mail main major make mammal man manage mandate mango mansion manual maple marble march margin marine market marriage mask mass master match material math matrix matter maximum maze meadow mean measure meat mechanic medal media melody melt member memory mention menu mercy merge merit merry mesh message metal method middle midnight milk million mimic mind minimum minor minute miracle mirror misery miss mistake mix mixed mixture mobile model modify mom moment monitor monkey monster month moon moral more morning mosquito mother motion motor mountain mouse move movie much muffin mule multiply muscle museum mushroom music must mutual myself mystery myth naive name napkin narrow nasty nation nature near neck need negative neglect neither nephew nerve nest net network neutral never news next nice night noble noise nominee noodle normal north nose notable note nothing notice novel now nuclear number nurse nut oak obey object oblige obscure observe obtain obvious occur ocean october odor off offer office often oil okay old olive olympic omit once one onion online only open opera opinion oppose option orange orbit orchard order ordinary organ orient original orphan ostrich other outdoor outer output outside oval oven over own owner oxygen oyster ozone pact paddle page pair palace palm panda panel panic panther paper parade parent park parrot party pass patch path patient patrol pattern pause pave payment peace peanut pear peasant pelican pen penalty pencil people pepper perfect permit person pet phone photo phrase physical piano picnic picture piece pig pigeon pill pilot pink pioneer pipe pistol pitch pizza place planet plastic plate play please pledge pluck plug plunge poem poet point polar pole police pond pony pool popular portion position possible post potato pottery poverty powder power practice praise predict prefer prepare present pretty prevent price pride primary print priority prison private prize problem process produce profit program project promote proof property prosper protect proud provide public pudding pull pulp pulse pumpkin punch pupil puppy purchase purity purpose purse push put puzzle pyramid quality quantum quarter question quick quit quiz quote rabbit raccoon race rack radar radio rail rain raise rally ramp ranch random range rapid rare rate rather raven raw razor ready real reason rebel rebuild recall receive recipe record recycle reduce reflect reform refuse region regret regular reject relax release relief rely remain remember remind remove render renew rent reopen repair repeat replace report require rescue resemble resist resource response result retire retreat return reunion reveal review reward rhythm rib ribbon rice rich ride ridge rifle right rigid ring riot ripple risk ritual rival river road roast robot robust rocket romance roof rookie room rose rotate rough round route royal rubber rude rug rule run runway rural sad saddle sadness safe sail salad salmon salon salt salute same sample sand satisfy satoshi sauce sausage save say scale scan scare scatter scene scheme school science scissors scorpion scout scrap screen script scrub sea search season seat second secret section security seed seek segment select sell seminar senior sense sentence series service session settle setup seven shadow shaft shallow share shed shell sheriff shield shift shine ship shiver shock shoe shoot shop short shoulder shove shrimp shrug shuffle shy sibling sick side siege sight sign silent silk silly silver similar simple since sing siren sister situate six size skate sketch ski skill skin skirt skull slab slam sleep slender slice slide slight slim slogan slot slow slush small smart smile smoke smooth snack snake snap sniff snow soap soccer social sock soda soft solar soldier solid solution solve someone song soon sorry sort soul sound soup source south space spare spatial spawn speak special speed spell spend sphere spice spider spike spin spirit split spoil sponsor spoon sport spot spray spread spring spy square squeeze squirrel stable stadium staff stage stairs stamp stand start state stay steak steel stem step stereo stick still sting stock stomach stone stool story stove strategy street strike strong struggle student stuff stumble style subject submit subway success such sudden suffer sugar suggest suit summer sun sunny sunset super supply supreme sure surface surge surprise surround survey suspect sustain swallow swamp swap swarm swear sweet swift swim swing switch sword symbol symptom syrup system table tackle tag tail talent talk tank tape target task taste tattoo taxi teach team tell ten tenant tennis tent term test text thank that theme then theory there they thing this thought three thrive throw thumb thunder ticket tide tiger tilt timber time tiny tip tired tissue title toast tobacco today toddler toe together toilet token tomato tomorrow tone tongue tonight tool tooth top topic topple torch tornado tortoise toss total tourist toward tower town toy track trade traffic tragic train transfer trap trash travel tray treat tree trend trial tribe trick trigger trim trip trophy trouble truck true truly trumpet trust truth try tube tuition tumble tuna tunnel turkey turn turtle twelve twenty twice twin twist two type typical ugly umbrella unable unaware uncle uncover under undo unfair unfold unhappy uniform unique unit universe unknown unlock until unusual unveil update upgrade uphold upon upper upset urban urge usage use used useful useless usual utility vacant vacuum vague valid valley valve van vanish vapor various vast vault vehicle velvet vendor venture venue verb verify version very vessel veteran viable vibrant vicious victory video view village vintage violin virtual virus visa visit visual vital vivid vocal voice void volcano volume vote voyage wage wagon wait walk wall walnut want warfare warm warrior wash wasp waste water wave way wealth weapon wear weasel weather web wedding weekend weird welcome west wet whale what wheat wheel when where whip whisper wide width wife wild will win window wine wing wink winner winter wire wisdom wise wish witness wolf woman wonder wood wool word work world worry worth wrap wreck wrestle wrist write wrong yard year yellow you young youth zebra zero zone zoo".split(" ");
const SYT = {
  title: "Sync between devices", intro: "Your progress moves between phone, tablet and computer, encrypted, through your own private repository on GitHub. Each device is set up once.",
  btn: "Sync between devices", setup: "Set up sync", now: "Sync now", code: "Pairing code", tokenNew: "Enter a new token", back: "Back", off: "Turn off on this device", board: "Back to the board",
  last: d => "Last sync: " + d, never: "Not synced yet.", busy: "Syncing…", devs: n => "Paired devices: " + n,
  footOn: "Progress is saved on this device and synced, encrypted, through GitHub. Transfer codes still work as before.",
  footOff: "Without sync, progress is saved only on this device.",
  boxOn: "Synced with your other devices.", boxErr: "Sync needs attention.",
  setupP: "Paste the token for the mailbox (it starts with github_pat_) and the name of the private repository.", tokenL: "Token", repoL: "Repository",
  connect: "Connect", checking: "Checking…", cancel: "Cancel", ok: "Continue",
  newCodeP: "This is the pairing code for all your devices. Write these 8 words down (ideally in a password manager). You will enter them on the other devices.", saved: "I have written them down",
  askCodeP: "The mailbox is already set up. Enter the 8 words of the pairing code from your first device, or scan it as a QR code. The first 4 letters of each word are enough.", codeL: "8 words", codeBad: "The code doesn’t match. Check all 8 words.",
  showCodeP: "Enter this code on another device when you set up sync there. Don’t send it to anyone.",
  joinT: "This device already has progress", joinP: (n, w) => `Here: ${n} file${n === 1 ? "" : "s"} closed, budget ${w}. Your other devices have their own progress. What should happen?`,
  joinAdopt: "Take the progress from my other devices", joinAdoptS: "Progress on this device is replaced. Best if it got here from a transfer code: otherwise the budget would be counted twice.",
  joinAdd: "Add this device’s progress", joinAddS: "Files, cards, words and budget from here are merged with the others.",
  first: "Sync is on.", done: "Synced.", offT: "Turn off sync on this device?", offP: "Progress on this device stays. Your other devices keep theirs and go on syncing.", offYes: "Yes, turn it off", offDone: "Sync is off on this device.",
  qrShow: "Show QR code", qrHide: "Hide QR code", qrHint: "On the other device tap “Scan QR code”. The code hides itself in 2 minutes.",
  qrScan: "Scan QR code", qrScanP: "On the other device open Sync between devices → Pairing code → Show QR code, and point the camera at it.",
  qrStarting: "Starting the camera…", qrLooking: "Looking for the code…", qrNoCam: "The camera isn’t available here. Type the 8 words instead.",
  qrDenied: "Gamgol isn’t allowed to use the camera. Allow it in the device settings, or type the 8 words instead.", qrWrong: "That isn’t a Gamgol pairing code.",
  tokenOk: "The token is saved.",
  resetOff: "Sync was turned off on this device, so the erased progress stays erased here only. Your other devices keep theirs.",
  loadOff: "Sync was turned off on this device, so the loaded code does not overwrite your other devices. To share it with them, set up sync again and choose “Add this device’s progress”.",
  upNew: v => `A new version of the app is ready: ${v}.`, upGet: "Download", upLater: "Later",
  e: { offline: "No internet connection. It will try again later.", token: "The token is invalid or has expired. Enter a new one.",
    notfound: "The repository can’t be opened. Check its name and the token’s permissions.", forbidden: "The repository can’t be opened. Check its name and the token’s permissions.",
    public: "That repository is public. For sync it must be private.", empty: "The repository is empty. Add a README file to it on GitHub.",
    meta: "The mailbox holds data of another app.", damaged: "Some data from another device couldn’t be read (a different pairing code?). The rest was synced.",
    http: s => `GitHub refused the request (${s}). Try again later.`, other: "Sync didn’t work. Try again later." } };
function syErrText(k) { if (!k) return ""; if (k.startsWith("http:")) return SYT.e.http(k.slice(5)); const f = SYT.e[k]; return typeof f === "string" ? f : SYT.e.other; }
const syLocal = () => !!(window.GG_LOCAL && store.local);

function syLoad() { try { const c = JSON.parse(localStorage.getItem(SY_KEY));
  if (c && SY_RE_REPO.test(c.repo || "") && SY_RE_BR.test(c.branch || "") && typeof c.token === "string" && typeof c.code === "string") {
    for (const k of ["seen", "dev", "it"]) if (!c[k] || typeof c[k] !== "object" || Array.isArray(c[k])) c[k] = {}; return c; } } catch (e) {} return null; }
function sySave() { try { if (SY) localStorage.setItem(SY_KEY, JSON.stringify(SY)); else localStorage.removeItem(SY_KEY); } catch (e) {} }
function syOn() { return !!(SY && syKey); }
const syEnc = s => new TextEncoder().encode(s);
const syHash = a => { let x = 2166136261; for (let i = 0; i < a.length; i++) x = Math.imul(x ^ a.charCodeAt(i), 16777619); return (x >>> 0).toString(36) + "." + a.length; };
function syB64(u8) { let s = ""; for (let i = 0; i < u8.length; i += 32768) s += String.fromCharCode.apply(null, u8.subarray(i, i + 32768)); return btoa(s); }
function syUnB64(s) { const b = atob(s), u = new Uint8Array(b.length); for (let i = 0; i < b.length; i++) u[i] = b.charCodeAt(i); return u; }

/* key, cipher, compression */
async function syDerive(code) { const ikm = await crypto.subtle.importKey("raw", syEnc(code), "HKDF", false, ["deriveKey"]);
  return crypto.subtle.deriveKey({ name: "HKDF", hash: "SHA-256", salt: syEnc("Gamgol sync v1"), info: syEnc("state") }, ikm, { name: "AES-GCM", length: 256 }, false, ["encrypt", "decrypt"]); }
async function sySeal(key, name, u8) { const iv = crypto.getRandomValues(new Uint8Array(12)), ct = new Uint8Array(await crypto.subtle.encrypt({ name: "AES-GCM", iv, additionalData: syEnc(name) }, key, u8));
  const o = new Uint8Array(12 + ct.length); o.set(iv); o.set(ct, 12); return o; }
async function syOpen(key, name, u8) { if (!(u8 instanceof Uint8Array) || u8.length < 28) throw new Error("short");
  return new Uint8Array(await crypto.subtle.decrypt({ name: "AES-GCM", iv: u8.slice(0, 12), additionalData: syEnc(name) }, key, u8.subarray(12))); }
async function syZip(u8, on) { const s = new Blob([u8]).stream().pipeThrough(on ? new CompressionStream("gzip") : new DecompressionStream("gzip")); return new Uint8Array(await new Response(s).arrayBuffer()); }
/* pairing code: 8 words from the 2048-word BIP39 list (88 bits); the first 4 letters of each word are enough */
function syNewCode() { return [...crypto.getRandomValues(new Uint16Array(8))].map(x => SY_WORDS[x & 2047]).join(" "); }
function syParseCode(s) { const ws = String(s || "").toLowerCase().replace(/[^a-z]+/g, " ").trim().split(" ").filter(Boolean); if (ws.length !== 8) return null; const out = [];
  for (const w of ws) { const m = SY_WORDS.includes(w) ? w : w.length >= 4 ? SY_WORDS.find(x => x.startsWith(w.slice(0, 4))) : null; if (!m) return null; out.push(m); } return out.join(" "); }
const SY_CHECK = "Gamgol sync check";
async function syCheckBlob(k) { return syB64(await sySeal(k, "check", syEnc(SY_CHECK))); }
async function syCheckOk(k, c) { try { return new TextDecoder().decode(await syOpen(k, "check", syUnB64(c))) === SY_CHECK; } catch (e) { return false; } }

/* GitHub REST API */
class SyErr extends Error { constructor(kind, status) { super(kind); this.kind = kind; this.status = status || 0; } }
async function gh(token, method, path, body, raw) { let r;
  try { r = await fetch(SY_API + path, { method, cache: "no-store", credentials: "omit", referrerPolicy: "no-referrer",
    headers: Object.assign({ Authorization: "Bearer " + token, Accept: raw ? "application/vnd.github.raw+json" : "application/vnd.github+json" }, body ? { "Content-Type": "application/json" } : {}), body: body ? JSON.stringify(body) : undefined }); }
  catch (e) { throw new SyErr("offline"); }
  if (r.status === 401) throw new SyErr("token", 401);
  if (!r.ok) throw new SyErr(r.status === 404 ? "notfound" : r.status === 403 ? "forbidden" : r.status === 409 ? "empty" : "http", r.status);
  if (raw) return new Uint8Array(await r.arrayBuffer()); if (r.status === 204) return null;
  try { return await r.json(); } catch (e) { throw new SyErr("http", r.status); } }
async function syCheckRepo(token, input) { let repo = String(input || "").trim().replace(/^https:\/\/github\.com\//, "").replace(/\.git$/, "").replace(/\/+$/, "");
  if (!repo.includes("/")) { const u = await gh(token, "GET", "/user"); if (!u || typeof u.login !== "string") throw new SyErr("http"); repo = u.login + "/" + (repo || SY_DEFREPO); }
  if (!SY_RE_REPO.test(repo)) throw new SyErr("notfound");
  const info = await gh(token, "GET", "/repos/" + repo); if (!info || info.private !== true) throw new SyErr("public");
  return info.full_name && SY_RE_REPO.test(info.full_name) ? info.full_name : repo; }
async function syReadMeta(token, repo) { let r; try { r = await gh(token, "GET", `/repos/${repo}/contents/${SY_META}`); } catch (e) { if (e.kind === "notfound") return null; throw e; }
  try { const m = JSON.parse(new TextDecoder().decode(syUnB64(String(r.content || "").replace(/\s+/g, "")))); if (m && m.app === SY_APP && m.sync === 1 && typeof m.check === "string") return m; } catch (e) {}
  throw new SyErr("meta"); }

/* ---------- what is synced and how ---------- */
const syNum = v => { v = +v; return isFinite(v) ? v : 0; };
const syObj = o => !!o && typeof o === "object" && !Array.isArray(o);
const syId = v => typeof v === "string" && v.length > 0 && v.length <= 80;
const syClamp = (v, a, b) => Math.max(a, Math.min(b, Math.round(syNum(v))));
const syCaseIds = () => new Set(allCh().flatMap(c => c.cases.map(k => k.id)));
/* counters as a flat map (no zeros): w = budget, n = answers given, r.<skill> / x.<skill> = right / wrong */
function syCount() { const o = {}, a = (k, v) => { v = syNum(v); if (v) o[k] = (o[k] || 0) + v; }; a("w", S.won); a("n", S.n);
  for (const sk in S.skills) { const k = S.skills[sk] || {}; a("r." + sk, k.r); a("x." + sk, k.w); } return o; }
function sySetCount(c) { const g = k => c[k] || 0; S.won = Math.round(g("w")); S.n = Math.max(0, Math.round(g("n")));
  for (const sk in S.skills) { const k = S.skills[sk]; k.r = Math.max(0, Math.round(g("r." + sk))); k.w = Math.max(0, Math.round(g("x." + sk))); }
  for (const key in c) { const m = /^([rx])\.(.+)$/.exec(key); if (!m || S.skills[m[2]] || !(c[key] > 0)) continue;
    const k = S.skills[m[2]] = { r: 0, w: 0, s: 0, weak: false }; k.r = Math.max(0, Math.round(g("r." + m[2]))); k.w = Math.max(0, Math.round(g("x." + m[2]))); } }
const SY_RE_CNT = /^(w|n|[rx]\.[A-Za-z0-9_.:-]{1,40})$/;
function syAdd(a, b, m = 1) { const o = Object.assign({}, a); for (const k in b) { const v = (o[k] || 0) + m * syNum(b[k]); if (v) o[k] = v; else delete o[k]; } return o; }
const syOwn = o => { const r = {}; if (syObj(o)) for (const k in o) if (SY_RE_CNT.test(k) && isFinite(+o[k]) && Math.abs(+o[k]) < 1e10) r[k] = +o[k]; return r; };
const syDevSum = dev => Object.values(dev).reduce((a, d) => syAdd(a, syOwn(d && d.own)), {});
/* union / maximum */
function sySets() { const A = att(), lw = {}, cr = {};
  for (const ch in S.vocab) { const w = (S.vocab[ch] || {}).w; if (syObj(w) && Object.keys(w).length) lw[ch] = w; }
  for (const ch in S.cards || {}) { const r = (S.cards[ch] || {}).r | 0; if (r) cr[ch] = r; }
  return { cs: Object.keys(S.cases).filter(k => S.cases[k]), sv: S.souvenirs.slice(), rp: Object.keys(S.repairs).filter(k => S.repairs[k]), gf: (S.gifts || []).slice(),
    best: S.best, rd: S.reads || {}, br: (S.brief || {}).day || "", lw, cr,
    at: { day: A.day, cnt: A.cnt, last: A.last, n: A.n, best: A.best, leave: A.leave, log: A.log, hit: A.hit } }; }
function syUnion(x) { if (!syObj(x)) return;
  if (Array.isArray(x.cs)) { const ok = syCaseIds(); x.cs.forEach(v => { if (ok.has(v) && !S.cases[v]) S.cases[v] = { closed: true }; }); }
  if (Array.isArray(x.sv)) x.sv.forEach(v => { if (syId(v) && !S.souvenirs.includes(v)) S.souvenirs.push(v); });
  if (Array.isArray(x.rp)) x.rp.forEach(v => { if (C.repairs.some(r => r.id === v)) S.repairs[v] = true; });
  if (Array.isArray(x.gf)) { const G = S.gifts || (S.gifts = []); x.gf.forEach(v => { if ((C.gifts || []).some(g => g.id === v) && !G.includes(v)) G.push(v); }); }
  if (syObj(x.best)) for (const k in x.best) if (chById(k)) S.best[k] = Math.max(S.best[k] || 0, syClamp(x.best[k], 0, 1e7));
  if (syObj(x.rd)) { const A = S.reads || (S.reads = {}); for (const k in x.rd) { const r = x.rd[k]; if (!syId(k) || !syObj(r)) continue; const p = A[k] || {};
    A[k] = { best: Math.max(p.best || 0, syClamp(r.best, 0, 99)), at: Math.max(syNum(p.at), syClamp(r.at, 0, 1e14)) }; } }
  if (typeof x.br === "string" && SY_DAY.test(x.br) && x.br > ((S.brief || {}).day || "")) (S.brief || (S.brief = {})).day = x.br;
  if (syObj(x.lw)) for (const ch in x.lw) { const c = chById(ch), w = x.lw[ch]; if (!c || !syObj(w)) continue;
    const V = S.vocab[ch] || (S.vocab[ch] = { order: [], ptr: 0, w: {} });
    for (const i in w) { const t = w[i]; if (!/^\d{1,4}$/.test(i) || +i >= c.vocab.length || !syObj(t)) continue; const o = V.w[i] || (V.w[i] = {});
      for (const k in t) { if (k === "n") o.n = Math.max(o.n || 0, syClamp(t.n, 0, 1e5)); else if (/^[a-z]{1,3}$/.test(k) && t[k] === 1) o[k] = 1; } } }
  if (syObj(x.cr)) for (const ch in x.cr) if (chById(ch)) { const K = cardsOf(chById(ch)); K.r = Math.max(K.r | 0, syClamp(x.cr[ch], 0, 1e6)); }
  syAtt(x.at); }
/* attendance book: the later stamped day (then the longer run) wins; best = max; marks hit and the 3-week log are joined */
function syAtt(b) { if (!syObj(b)) return; const A = att(), n = v => syClamp(v, 0, 1e5), day = v => typeof v === "string" && SY_DAY.test(v) ? v : "";
  const B = { day: day(b.day), cnt: n(b.cnt), last: day(b.last), n: n(b.n), best: n(b.best), leave: syClamp(b.leave, 0, 2) };
  if (B.last > (A.last || "") || (B.last && B.last === A.last && B.n > (A.n | 0))) { A.last = B.last; A.n = B.n; A.leave = B.leave; }
  A.best = Math.max(A.best | 0, B.best, A.n | 0);
  if (B.day > (A.day || "")) { A.day = B.day; A.cnt = B.cnt; } else if (B.day && B.day === A.day) A.cnt = Math.max(A.cnt | 0, B.cnt);
  if (Array.isArray(b.hit)) b.hit.forEach(v => { if (ATT_MARKS.some(m => m.n === v) && !A.hit.includes(v)) A.hit.push(v); });
  if (syObj(b.log)) for (const k in b.log) { const v = b.log[k]; if (day(k) && (v === "s" || v === "l") && A.log[k] !== "s") A.log[k] = v; } }
/* last changed wins, per item: k:<skill> state, v:<skill> review schedule, c:<chapter>|<card> box, m:<Mnemo key>, g:r half-finished file, g:o unfolded chapter */
function syItems() { const m = new Map(), put = (p, o) => { if (syObj(o)) for (const k in o) if (o[k] != null) m.set(p + k, o[k]); };
  for (const sk in S.skills) { const k = S.skills[sk] || {}, ro = S.reopen.find(x => x.skill === sk); if (k.s || k.weak || ro) m.set("k:" + sk, [k.s | 0, k.weak ? 1 : 0, ro ? ro.at | 0 : -1]); }
  put("v:", S.rv); put("m:", mnS().c);
  for (const ch in S.cards || {}) { const K = S.cards[ch] || {}, b = K.b || {}, t = K.t || {};
    for (const id of new Set([...Object.keys(b), ...Object.keys(t)])) m.set("c:" + ch + "|" + id, [b[id] | 0, t[id] == null ? -9 : t[id] | 0]); }
  if (S.resume) m.set("g:r", S.resume);
  if (S.openCh) m.set("g:o", S.openCh);
  return m; }
/* a value from another device: normalised, or undefined when it is not valid */
function syNorm(k, v) { const p = k.slice(0, 2), id = k.slice(2); if (!id || id.length > 120) return undefined; if (v === null) return null;
  const int = (x, a, b) => Number.isInteger(x) && x >= a && x <= b;
  if (p === "k:") return Array.isArray(v) && v.length === 3 && int(v[0], 0, 1e5) && (v[1] === 0 || v[1] === 1) && int(v[2], -1, 1e9) ? v : undefined;
  if (p === "v:") return syObj(v) && int(v.b, 0, 20) && typeof v.d === "string" && SY_DAY.test(v.d) ? { b: v.b, d: v.d } : undefined;
  if (p === "m:") return Array.isArray(v) && v.length === 5 && v.every(x => typeof x === "number" && isFinite(x)) ? v : undefined;
  if (p === "c:") { const ch = id.split("|")[0]; return chById(ch) && Array.isArray(v) && v.length === 2 && int(v[0], 0, 2) && int(v[1], -9, 1e6) ? v : undefined; }
  if (k === "g:r") { if (!syObj(v) || !syCaseIds().has(v.cs) || !chById(v.ch) || JSON.stringify(v).length > 20000) return undefined; return v; }
  if (k === "g:o") return syObj(v) && typeof v.id === "string" && (v.id === "" || chById(v.id)) ? { id: v.id, done: !!v.done } : undefined;
  return undefined; }
function syPut(k, v) { const p = k.slice(0, 2), id = k.slice(2);
  if (p === "k:") { const s = S.skills[id] || (S.skills[id] = { r: 0, w: 0, s: 0, weak: false }); s.s = v ? v[0] : 0; s.weak = !!(v && v[1]);
    S.reopen = S.reopen.filter(x => x.skill !== id); if (v && v[2] >= 0) S.reopen.push({ skill: id, at: v[2] }); }
  else if (p === "v:") { const V = S.rv || (S.rv = {}); if (v === null) delete V[id]; else V[id] = v; }
  else if (p === "m:") { const c = mnS().c; if (v === null) delete c[id]; else c[id] = v; }
  else if (p === "c:") { const i = id.indexOf("|"), ch = chById(id.slice(0, i)), cid = id.slice(i + 1); if (!ch) return; const K = cardsOf(ch);
    if (v === null || (!v[0] && v[1] === -9)) { delete K.b[cid]; delete K.t[cid]; } else { if (v[0]) K.b[cid] = v[0]; else delete K.b[cid]; if (v[1] !== -9) K.t[cid] = v[1]; else delete K.t[cid]; } }
  else if (k === "g:r") { if (v === null || (v && S.cases[v.cs])) delete S.resume; else S.resume = JSON.parse(JSON.stringify(v)); }
  else if (k === "g:o") { if (v === null) delete S.openCh; else S.openCh = v; } }
/* note when an item changed (called from save()); init: items found when sync is switched on get weight 1 */
function syTouch(init) { if (!SY) return false; const it = SY.it || (SY.it = {}), cur = syItems(), now = Math.round(Date.now() - (SY.skew || 0)); let ch = false;
  for (const [k, v] of cur) { const s = JSON.stringify(v), o = it[k]; if (o && o[0] === s) continue;
    it[k] = [s, init ? Math.max(o ? o[1] : 0, 1) : Math.max(now, (o ? o[1] : 0) + 1)]; ch = true; }
  for (const k in it) if (!cur.has(k) && it[k][0] !== "null") { it[k] = ["null", init ? it[k][1] : Math.max(now, it[k][1] + 1)]; ch = true; }
  return ch; }
/* items from another device: the later change wins (a tie goes to the larger value, so every device ends the same) */
function syTake(it) { if (!syObj(it)) return 0; let n = 0; const L = SY.it;
  for (const k in it) { const e = it[k]; if (!Array.isArray(e) || e.length !== 2) continue; const at = +e[1]; if (!(at > 0 && isFinite(at))) continue;
    const v = syNorm(k, e[0]); if (v === undefined) continue; const s = JSON.stringify(v), o = L[k] || ["null", 0];
    if (at > o[1] || (at === o[1] && s > o[0])) { syPut(k, v); L[k] = [s, at]; n++; } }
  return n; }
/* "take the progress from my other devices": start from an empty file, keeping what belongs to this device only */
function syWipe() { const keep = { theme: S.theme, osk: S.osk, typing: S.typing, vocab: {} };
  for (const ch in S.vocab) { const V = S.vocab[ch] || {}; keep.vocab[ch] = { order: Array.isArray(V.order) ? V.order : [], ptr: V.ptr | 0, w: {} }; }
  S = Object.assign(fresh(), keep); SY.it = {}; }
function syMerge(present, got) { const c = SY, adopt = !c.joined && c.join === "adopt", old = c.dev;
  syTouch(false);
  const O = adopt ? {} : syAdd(syCount(), syDevSum(old), -1);
  const dev = {}; for (const br of present) { if (got[br]) { dev[br] = { own: syOwn(got[br].d.own) }; c.seen[br] = got[br].cs; } else if (old[br]) dev[br] = old[br]; }
  for (const br in c.seen) if (!present.has(br)) delete c.seen[br];
  c.dev = dev;
  if (adopt) syWipe();
  sySetCount(syAdd(O, syDevSum(dev)));
  for (const br in got) { const d = got[br].d; syUnion(d.sets); syTake(d.it); }
  if (S.resume && S.cases[S.resume.cs]) delete S.resume;
  migrate();
  return { O }; }
/* the progress and the sync state are written together (else a counter could be counted twice) */
function syPersist() { try { if (store.state === "on" && store.ref) { store.ref.set(JSON.parse(JSON.stringify(S))); } } catch (e) {} sySave(); }
const syFingerprint = () => JSON.stringify([syCount(), sySets()]);

/* ---------- one sync ---------- */
/* quick (on leaving the app): upload only, no downloads from the other devices (they come at the next sync), and when this
   device has uploaded before, not even the branch list: as few requests as possible before Android stops the app */
async function syNow(manual, quick) { if (!syOn()) return false; if (syBusy) { if (quick) syAgain = true; return false; } syBusy = true; syAgain = false; const c = SY, P = "/repos/" + c.repo; c.lastAttempt = Date.now(); sySave(); syRefresh();
  let ok = false, damaged = false, res = null, before = "";
  try { before = syFingerprint() + JSON.stringify([...syItems()]);
    const short = quick && !manual && !!c.upHash, refs = short ? [] : await gh(c.token, "GET", P + "/git/matching-refs/heads/gg-"), present = new Set(short ? Object.keys(c.dev) : []), got = {}; let own = short ? "kept" : null;
    for (const ref of Array.isArray(refs) ? refs : []) { const br = String(ref.ref || "").replace(/^refs\/heads\//, ""), cs = ref.object && ref.object.sha;
      if (!SY_RE_BR.test(br) || !SY_SHA.test(cs || "")) continue;
      if (br === c.branch) { own = cs; continue; }
      present.add(br); if (!manual && (quick || c.seen[br] === cs && c.dev[br])) continue;
      try { const cm = await gh(c.token, "GET", `${P}/git/commits/${cs}`), ts = cm && cm.tree && cm.tree.sha; if (!SY_SHA.test(ts || "")) throw new SyErr("http");
        const tr = await gh(c.token, "GET", `${P}/git/trees/${ts}`), e = (Array.isArray(tr.tree) ? tr.tree : []).find(x => x.path === "state" && x.type === "blob" && SY_SHA.test(x.sha || ""));
        if (!e) continue;
        const d = JSON.parse(new TextDecoder().decode(await syZip(await syOpen(syKey, "state", await gh(c.token, "GET", `${P}/git/blobs/${e.sha}`, null, true)), false)));
        if (!d || d.app !== SY_APP || d.v !== 1) throw new Error("shape"); got[br] = { d, cs }; }
      catch (e) { if (e instanceof SyErr) throw e; console.warn("sync: unreadable", br, e); damaged = true; } }
    if (c !== SY) return false;
    res = syMerge(present, got); syPersist(); syFp = syFingerprint();
    const it = {}; for (const k in c.it) { const [s, at] = c.it[k]; if (at > 0) it[k] = [JSON.parse(s), at]; }
    const body = JSON.stringify({ app: SY_APP, v: 1, own: res.O, sets: sySets(), it }), hs = syHash(body);
    if (hs !== c.upHash || !own) {
      const blob = await gh(c.token, "POST", P + "/git/blobs", { content: syB64(await sySeal(syKey, "state", await syZip(syEnc(body), true))), encoding: "base64" });
      const tr = await gh(c.token, "POST", P + "/git/trees", { tree: [{ path: "state", mode: "100644", type: "blob", sha: blob.sha }] });
      const t0 = Date.now(), cm = await gh(c.token, "POST", P + "/git/commits", { message: "Gamgol sync", tree: tr.sha, parents: [] });
      const sd = Date.parse(((cm && cm.committer) || {}).date || ""); if (isFinite(sd)) c.skew = Math.round((t0 + Date.now()) / 2 - sd);
      if (own) await gh(c.token, "PATCH", `${P}/git/refs/heads/${c.branch}`, { sha: cm.sha, force: true });
      else await gh(c.token, "POST", P + "/git/refs", { ref: "refs/heads/" + c.branch, sha: cm.sha });
      c.upHash = hs; }
    c.joined = true; delete c.join; c.lastSync = Date.now(); c.lastError = damaged ? "damaged" : null; ok = true; }
  catch (e) { console.warn("sync failed", e); c.lastError = e instanceof SyErr ? (e.kind === "http" && e.status ? "http:" + e.status : e.kind) : "other"; }
  finally { syBusy = false; if (SY === c) sySave(); if (syAgain) { syAgain = false; if (document.hidden) setTimeout(() => syNow(false, true), 0); } }
  if (res && before !== syFingerprint() + JSON.stringify([...syItems()])) syShow();
  syRefresh(manual ? (ok ? (damaged ? SYT.e.damaged : SYT.done) : "") : "");
  return ok; }
/* after a merge: repaint the board, but never in the middle of a round (the budget in the header is updated quietly) */
function syShow() { const w = $("#won"); if (w) w.textContent = won(S.won);
  if (R.screen === "home") { const y = window.scrollY; drawHeader(); home(); window.scrollTo(0, y); } }

/* when: on start, on coming back to the app, on leaving it, every minute while it is open, a moment after a change */
function syMaybe(gap) { if (!syOn() || syBusy || navigator.onLine === false) return; const e = SY.lastError,
  w = SY_HARD.includes(e) ? SY_RETRY : e && e !== "damaged" ? Math.max(gap, SY_ERRWAIT) : gap;
  if (Date.now() - (SY.lastAttempt || 0) >= w) syNow(false); }
/* a moment after a change: 3 s on the board (a round just ended), 15 s during a round (a batch of changes = one upload);
   a later change never pushes an earlier deadline further away */
function sySoon() { if (!syOn()) return; const due = Date.now() + (R.screen === "home" ? SY_HOME : SY_SOON); if (sySoonT && sySoonAt <= due) return;
  clearTimeout(sySoonT); sySoonAt = due; sySoonT = setTimeout(() => { sySoonT = null; if (syBusy) sySoon(); else syMaybe(0); }, due - Date.now()); }
function syChanged() { if (!SY) return; const t = syTouch(false), f = syFingerprint(); if (t) sySave(); if (t || f !== syFp) { syFp = f; sySoon(); } }
function syBoot() { if (!syLocal()) return; SY = syLoad(); if (!SY) return; syTouch(false); syFp = syFingerprint(); sySave();
  syDerive(SY.code).then(k => { syKey = k; syRefresh(); setTimeout(() => syMaybe(0), 1500); }).catch(e => console.warn("sync key", e)); }
document.addEventListener("visibilitychange", () => { if (!syOn()) return;
  if (document.hidden) { clearTimeout(sySoonT); sySoonT = null; syLeave(); } else setTimeout(() => syMaybe(SY_BACK), 300); });
/* leaving the app: upload at once (quick), also right after a sync that was still running */
function syLeave() { if (!syOn() || navigator.onLine === false) return; const e = SY.lastError; if (SY_HARD.includes(e) && Date.now() - (SY.lastAttempt || 0) < SY_RETRY) return; syNow(false, true); }
window.__syLeave = syLeave;
window.addEventListener("online", () => setTimeout(() => syMaybe(0), 2000));
setInterval(() => { if (!document.hidden) syMaybe(SY_POLL); }, 10000);
/* "Erase all progress" or loading a transfer code with sync on: only here, and sync is turned off on this device
   (else an erase would be subtracted on every device, and a loaded code would overwrite them) */
function syReset(why) { if (!SY) return; clearTimeout(sySoonT); sySoonT = null; SY = null; syKey = null; sySave(); syResetNote = why === "load" ? SYT.loadOff : SYT.resetOff; }

/* ---------- hooks into the game (functions declared by the game are replaced in place) ---------- */
{ const f = save; save = function () { f.apply(this, arguments); syChanged(); }; }
{ const f = home; home = function () { const r = f.apply(this, arguments); syBox(); upShow();
  if (sySoonT && sySoonAt > Date.now() + SY_HOME) { clearTimeout(sySoonT); sySoonT = null; sySoon(); }   /* back on the board: upload soon */
  return r; }; }
{ const f = setMain; setMain = function () { syScanStop(); return f.apply(this, arguments); }; }
{ const f = boot; boot = async function () { await f.apply(this, arguments); syBoot(); setTimeout(upCheck, 4000); }; }

/* ---------- screens ---------- */
function syWhen(t) { return new Date(t).toLocaleString("en-GB", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" }); }
const syBad = () => !!(SY && SY.lastError && SY.lastError !== "damaged");
/* the board: a button in "Your progress", and a note after an erase / a loaded code turned sync off */
function syBox() { if (!syLocal()) return; const mb = $(".movebox"); if (!mb) return; const row = mb.querySelector(".row");
  const b = document.createElement("button"); b.className = "btn alt sm"; b.type = "button"; b.id = "sylink"; b.textContent = SYT.btn + (syBad() ? " ⚠" : SY ? " ✓" : ""); b.onclick = () => syScreen();
  if (row) row.append(b);
  if (SY) { const s = document.createElement("span"); s.className = "sy-state"; s.textContent = syBad() ? SYT.boxErr : SYT.boxOn; mb.querySelector("span").after(s); }
  if (syResetNote) { const n = document.createElement("div"); n.className = "notice soft"; n.style.marginTop = "8px"; n.textContent = syResetNote; syResetNote = ""; mb.append(n); } }
function syStatus() { if (!SY) return ""; if (syBusy) return SYT.busy; if (syBad()) return syErrText(SY.lastError);
  return (SY.lastSync ? SYT.last(syWhen(SY.lastSync)) : SYT.never) + (SY.lastError === "damaged" ? " " + SYT.e.damaged : ""); }
function syRefresh(msg) { const lk = $("#sylink"); if (lk) lk.textContent = SYT.btn + (syBad() ? " ⚠" : SY ? " ✓" : "");
  if (R.screen !== "sync") return; const st = $("#sy-st"); if (!st) return;
  st.className = "narr" + (SY && !syBusy && syBad() ? " sy-bad" : ""); st.textContent = syStatus();
  const nb = $("#sy-now"); if (nb) nb.disabled = syBusy;
  const dv = $("#sy-dev"); if (dv) dv.textContent = SY && SY.joined ? SYT.devs(Object.keys(SY.dev).length + 1) : "";
  const ms = $("#sy-msg"); if (ms && msg) ms.innerHTML = `<em>${esc(msg)}</em>`;
  const tk = $("#sy-tok-btn"); if (tk) tk.hidden = !(SY && SY.lastError === "token"); }
/* one card per sync screen; R.screen "sync" keeps the phone's back button going to the board */
function syCard(html, screen) { R = { screen: screen || "sync" }; drawHeader();
  setMain(`<div class="card sync"><p class="place"><span>Sync · 동기화</span><span id="sy-dev"></span></p>${html}</div>`); }
const syBtn = (t, id, cls) => `<button class="btn${cls ? " " + cls : ""}" type="button" id="${id}">${esc(t)}</button>`;
const syErrBox = '<p class="narr sy-bad" id="sy-err" hidden></p>';
function syErr(k, txt) { const e = $("#sy-err"); if (e) { e.textContent = txt || syErrText(k); e.hidden = !(txt || k); } }
function syScreen(msg) { msg = typeof msg === "string" ? msg : "";
  syCard(`<h2>${SYT.title}</h2><p class="narr">${SYT.intro}</p>${SY ? '<p class="narr" id="sy-st"></p>' : ""}<p class="narr" id="sy-msg">${msg ? `<em>${esc(msg)}</em>` : ""}</p>
    <div class="row">${SY ? syBtn(SYT.now, "sy-now") + syBtn(SYT.code, "sy-code-btn", "alt") + syBtn(SYT.tokenNew, "sy-tok-btn", "alt") + syBtn(SYT.off, "sy-off", "alt") : syBtn(SYT.setup, "sy-setup")}${syBtn(SYT.board, "sy-home", "alt")}</div>
    <p class="rnote" style="margin-top:12px"><em>${SY ? SYT.footOn : SYT.footOff}</em></p>`);
  $("#sy-home").onclick = leave;
  if (!SY) $("#sy-setup").onclick = sySetup;
  else { $("#sy-now").onclick = () => syNow(true); $("#sy-code-btn").onclick = syShowCode; $("#sy-tok-btn").onclick = syToken; $("#sy-off").onclick = syOffAsk; }
  syRefresh(); }
const syField = (label, id, type, ph, val) => `<label class="sy-field"><span>${esc(label)}</span><input class="sy-in" id="${id}" type="${type}" autocomplete="off" spellcheck="false" autocapitalize="off"${ph ? ` placeholder="${esc(ph)}"` : ""}${val ? ` value="${esc(val)}"` : ""}></label>`;
const syPend = {};
function sySetup() { for (const k in syPend) delete syPend[k];
  syCard(`<h2>${SYT.setup}</h2><p class="narr">${SYT.setupP}</p>${syField(SYT.tokenL, "sy-tok", "password", "github_pat_…")}${syField(SYT.repoL, "sy-repo", "text", "", SY_DEFREPO)}${syErrBox}
    <div class="row">${syBtn(SYT.connect, "sy-go")}${syBtn(SYT.cancel, "sy-cancel", "alt")}</div>`, "sync-setup");
  $("#sy-cancel").onclick = () => syScreen();
  const go = $("#sy-go"); go.onclick = async () => { const token = $("#sy-tok").value.trim(); if (!/^[A-Za-z0-9_]{20,255}$/.test(token)) { syErr("token"); return; }
    go.disabled = true; go.textContent = SYT.checking; syErr("");
    try { const repo = await syCheckRepo(token, $("#sy-repo").value), meta = await syReadMeta(token, repo); Object.assign(syPend, { token, repo, meta });
      if (meta) { syAskCode(); return; }
      syPend.code = syNewCode(); syNewCodeScreen(); }
    catch (e) { console.warn("sync setup", e); go.disabled = false; go.textContent = SYT.connect; syErr(e instanceof SyErr ? e.kind : "other"); } }; }
const syWordsEl = code => '<ol class="sy-words">' + code.split(" ").map(w => `<li>${esc(w)}</li>`).join("") + "</ol>";
/* the QR code holds only "GAMGOL:" + the 8 words in capitals (no token); shown only on request, hides itself after 2 minutes */
const SY_QR = "GAMGOL:", SY_QR_MS = 120000; let syQrT = 0, syCam = null;
const syQrHtml = () => window.GGQR ? `<div class="sy-qr" id="sy-qr" hidden><div class="sy-qrimg"></div><p class="rnote"><em>${SYT.qrHint}</em></p></div>` : "";
function syQrBind(code) { const b = $("#sy-qrb"), box = $("#sy-qr"); if (!b || !box) return;
  b.onclick = () => { clearTimeout(syQrT); if (!box.hidden) { box.hidden = true; box.firstChild.innerHTML = ""; b.textContent = SYT.qrShow; return; }
    try { box.firstChild.innerHTML = GGQR.svg(SY_QR + code.toUpperCase(), "M"); } catch (e) { console.warn("qr", e); return; }
    box.hidden = false; b.textContent = SYT.qrHide; box.scrollIntoView({ block: "nearest" });
    syQrT = setTimeout(() => { if (document.contains(box)) { box.hidden = true; box.firstChild.innerHTML = ""; b.textContent = SYT.qrShow; } }, SY_QR_MS); }; }
function syQrCode(t) { const s = String(t || "").trim(); return s.slice(0, SY_QR.length).toUpperCase() === SY_QR ? syParseCode(s.slice(SY_QR.length)) : null; }
function syNewCodeScreen() { const p = syPend;
  syCard(`<h2>${SYT.code}</h2><p class="narr">${SYT.newCodeP}</p>${syWordsEl(p.code)}${syErrBox}
    <div class="row">${syBtn(SYT.saved, "sy-saved")}${window.GGQR ? syBtn(SYT.qrShow, "sy-qrb", "alt") : ""}${syBtn(SYT.cancel, "sy-cancel", "alt")}</div>${syQrHtml()}`, "sync-setup");
  syQrBind(p.code); $("#sy-cancel").onclick = () => syScreen();
  const go = $("#sy-saved"); go.onclick = async () => { go.disabled = true;
    try { p.key = await syDerive(p.code);
      const content = syB64(syEnc(JSON.stringify({ app: SY_APP, sync: 1, created: new Date().toISOString(), check: await syCheckBlob(p.key) }, null, 1)));
      try { await gh(p.token, "PUT", `/repos/${p.repo}/contents/${SY_META}`, { message: "Gamgol sync", content }); }
      catch (x) { /* another device created it meanwhile: enter its code */ const m = await syReadMeta(p.token, p.repo).catch(() => null); if (!m) throw x; p.meta = m; syAskCode(); return; }
      await syJoin(); } catch (x) { console.warn("sync setup", x); go.disabled = false; syErr(x instanceof SyErr ? x.kind : "other"); } }; }
function syAskCode() {
  syCard(`<h2>${SYT.code}</h2><p class="narr">${SYT.askCodeP}</p><label class="sy-field"><span>${SYT.codeL}</span><textarea class="codebox sy-codein" id="sy-code" rows="3" spellcheck="false" autocapitalize="off" autocomplete="off"></textarea></label>${syErrBox}
    <div class="row">${syBtn(SYT.ok, "sy-codego")}${window.GGQR ? syBtn(SYT.qrScan, "sy-scan", "alt") : ""}${syBtn(SYT.cancel, "sy-cancel", "alt")}</div>`, "sync-setup");
  $("#sy-codego").onclick = () => syCodeGo($("#sy-codego")); if ($("#sy-scan")) $("#sy-scan").onclick = syScan; $("#sy-cancel").onclick = () => syScreen(); }
async function syCodeGo(b) { const code = syParseCode($("#sy-code").value); if (!code) { syErr(0, SYT.codeBad); return; }
  b.disabled = true; try { const k = await syDerive(code); if (!await syCheckOk(k, syPend.meta.check)) { syErr(0, SYT.codeBad); b.disabled = false; return; }
    Object.assign(syPend, { code, key: k }); await syJoin(); } catch (x) { b.disabled = false; syErr(x instanceof SyErr ? x.kind : "other"); } }
function syNewBranch() { return "gg-" + [...crypto.getRandomValues(new Uint8Array(6))].map(b => b.toString(16).padStart(2, "0")).join(""); }
const syHasProgress = () => Object.keys(S.cases).length > 0 || S.won !== 0 || Object.keys(mnS().c).length > 0 || Object.keys(S.cards || {}).length > 0 || Object.keys(S.skills).length > 0;
/* another device: progress here and the others have some too → ask; otherwise take theirs */
async function syJoin() { const p = syPend; let others = 0;
  try { const refs = await gh(p.token, "GET", `/repos/${p.repo}/git/matching-refs/heads/gg-`); others = (Array.isArray(refs) ? refs : []).filter(r => SY_RE_BR.test(String(r.ref || "").replace(/^refs\/heads\//, ""))).length; }
  catch (e) { if (!(e instanceof SyErr && e.kind === "notfound")) throw e; }
  if (!others) { syStart("add"); return; }
  if (syHasProgress()) { const n = Object.keys(S.cases).length;
    syCard(`<h2>${SYT.joinT}</h2><p class="narr">${esc(SYT.joinP(n, won(S.won)))}</p>
      <button class="btn sy-wide" type="button" id="sy-adopt">${SYT.joinAdopt}</button><p class="rnote"><em>${SYT.joinAdoptS}</em></p>
      <button class="btn alt sy-wide" type="button" id="sy-add">${SYT.joinAdd}</button><p class="rnote"><em>${SYT.joinAddS}</em></p>
      <div class="row" style="margin-top:10px">${syBtn(SYT.cancel, "sy-cancel", "alt")}</div>`, "sync-setup");
    $("#sy-adopt").onclick = () => syStart("adopt"); $("#sy-add").onclick = () => syStart("add"); $("#sy-cancel").onclick = () => syScreen(); return; }
  syStart("adopt"); }
async function syStart(mode) { const p = syPend;
  SY = { repo: p.repo, branch: syNewBranch(), token: p.token, code: p.code, join: mode, joined: false, seen: {}, dev: {}, it: {}, lastSync: 0, lastAttempt: 0, lastError: null, skew: 0 };
  syKey = p.key; syTouch(true); syFp = syFingerprint(); sySave(); for (const k in syPend) delete syPend[k]; syScreen();
  const ok = await syNow(false); syRefresh(ok ? SYT.first : ""); }
function syShowCode() { if (!SY) return; const code = SY.code;
  syCard(`<h2>${SYT.code}</h2><p class="narr">${SYT.showCodeP}</p>${syWordsEl(code)}<div class="row">${window.GGQR ? syBtn(SYT.qrShow, "sy-qrb", "alt") : ""}${syBtn(SYT.back, "sy-back", "alt")}</div>${syQrHtml()}`, "sync-code");
  syQrBind(code); $("#sy-back").onclick = () => syScreen(); }
function syToken() {
  syCard(`<h2>${SYT.tokenNew}</h2>${syField(SYT.tokenL, "sy-tok", "password", "github_pat_…")}${syErrBox}<div class="row">${syBtn(SYT.ok, "sy-go")}${syBtn(SYT.cancel, "sy-cancel", "alt")}</div>`, "sync-setup");
  $("#sy-cancel").onclick = () => syScreen();
  const go = $("#sy-go"); go.onclick = async () => { const token = $("#sy-tok").value.trim(); if (!SY || !/^[A-Za-z0-9_]{20,255}$/.test(token)) { syErr("token"); return; }
    go.disabled = true; try { const repo = await syCheckRepo(token, SY.repo), m = await syReadMeta(token, repo); if (!m || !await syCheckOk(syKey, m.check)) throw new SyErr("meta");
      SY.token = token; SY.lastError = null; SY.lastAttempt = 0; sySave(); syScreen(SYT.tokenOk); syNow(false); }
    catch (x) { go.disabled = false; syErr(x instanceof SyErr ? x.kind : "other"); } }; }
function syOffAsk() {
  syCard(`<h2>${SYT.offT}</h2><p class="narr">${SYT.offP}</p><div class="row">${syBtn(SYT.offYes, "sy-offyes", "red")}${syBtn(SYT.cancel, "sy-cancel", "alt")}</div>`, "sync-setup");
  $("#sy-cancel").onclick = () => syScreen();
  $("#sy-offyes").onclick = () => { clearTimeout(sySoonT); sySoonT = null; SY = null; syKey = null; sySave(); syScreen(SYT.offDone); }; }
/* camera: back camera, BarcodeDetector where it exists, otherwise the decoder in qr.js */
function syScanStop() { const c = syCam; syCam = null; if (!c) return; c.done = true; clearTimeout(c.t); if (c.stream) c.stream.getTracks().forEach(t => { try { t.stop(); } catch (e) {} }); }
async function syScan() { syScanStop();
  syCard(`<h2>${SYT.qrScan}</h2><p class="narr">${SYT.qrScanP}</p><div class="sy-cam"><video playsinline muted autoplay></video><div class="sy-frame"></div></div><p class="narr" id="sy-cst">${SYT.qrStarting}</p>
    <div class="row">${syBtn(SYT.cancel, "sy-scanback", "alt")}</div>`, "sync-setup");
  const video = $(".sy-cam video"), st = $("#sy-cst"); video.muted = true;
  $("#sy-scanback").onclick = () => { syScanStop(); syAskCode(); };
  const cam = syCam = { done: false, t: 0, stream: null, det: null }, cv = document.createElement("canvas");
  const say = (s, bad) => { if (cam.done) return; st.textContent = s; st.classList.toggle("sy-bad", !!bad); };
  if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) { say(SYT.qrNoCam, 1); return; }
  try { cam.stream = await navigator.mediaDevices.getUserMedia({ audio: false, video: { facingMode: { ideal: "environment" }, width: { ideal: 1280 }, height: { ideal: 720 } } }); }
  catch (e) { console.warn("camera", e); say(e && (e.name === "NotAllowedError" || e.name === "SecurityError") ? SYT.qrDenied : SYT.qrNoCam, 1); return; }
  if (cam.done || !document.contains(video)) { cam.stream.getTracks().forEach(t => t.stop()); if (syCam === cam) syCam = null; return; }
  try { if ("BarcodeDetector" in window && (await BarcodeDetector.getSupportedFormats()).includes("qr_code")) cam.det = new BarcodeDetector({ formats: ["qr_code"] }); } catch (e) { cam.det = null; }
  video.srcObject = cam.stream; try { await video.play(); } catch (e) {} say(SYT.qrLooking);
  const tick = async () => { if (cam.done) return;
    if (!document.contains(video)) { if (syCam === cam) syScanStop(); else { cam.done = true; cam.stream.getTracks().forEach(t => t.stop()); } return; }
    if (video.readyState >= 2 && video.videoWidth) {
      try { const k = Math.min(1, 800 / Math.max(video.videoWidth, video.videoHeight)), w = cv.width = Math.round(video.videoWidth * k), hh = cv.height = Math.round(video.videoHeight * k), ctx = cv.getContext("2d", { willReadFrequently: true });
        ctx.drawImage(video, 0, 0, w, hh); let t = null;
        if (cam.det) { try { const r = await cam.det.detect(cv); if (r && r[0] && r[0].rawValue) t = r[0].rawValue; } catch (e) { cam.det = null; } }
        if (t == null && window.GGQR) t = GGQR.decode(ctx.getImageData(0, 0, w, hh), 80);
        if (t != null && !cam.done) { const code = syQrCode(t);
          if (code) { syScanStop(); syAskCode(); $("#sy-code").value = code; syCodeGo($("#sy-codego")); return; }
          say(SYT.qrWrong, 1); } }
      catch (e) { console.warn("qr", e); } }
    cam.t = setTimeout(tick, 150); };
  tick(); }
{ const st = document.createElement("style"); st.textContent = `.sync .place{display:flex;justify-content:space-between;gap:8px}.sync .sy-field{display:flex;flex-direction:column;gap:4px;margin:10px 0}
.sync .sy-in{font:16px var(--f-body,inherit);padding:10px;border:1.5px solid var(--ink);border-radius:5px;background:var(--paper);color:var(--ink);width:100%;box-sizing:border-box}
.sync .sy-words{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:4px 18px;margin:12px 0;padding-left:28px;font-family:"Courier Prime",monospace;font-size:18px}
.sync textarea.sy-codein{font-size:16px}.sync .sy-qr{margin:12px 0}.sync .sy-qrimg{background:#fff;padding:12px;max-width:300px;margin:0 auto}.sync .sy-qrimg svg{display:block;width:100%;height:auto}
.sync .sy-cam{position:relative;max-width:420px;margin:10px auto;background:#000;aspect-ratio:4/3;overflow:hidden}.sync .sy-cam video{width:100%;height:100%;object-fit:cover;display:block}
.sync .sy-frame{position:absolute;inset:18%;border:3px solid var(--gold,#d8a531);pointer-events:none}.sync .row{margin:12px 0 0}.sync .sy-wide{display:block;width:100%;margin-top:12px}
.sync .sy-bad,.movebox .sy-bad{color:var(--stamp)}.movebox .sy-state{display:block;margin-top:4px;font-size:13px}
.upbar{margin-bottom:12px}.upbar .row{margin-top:8px}`; document.head.append(st); }

/* ---------- new version (APK only): once in 20 h ask GitHub for the latest release and offer the download on the board ----------
   Public data, no token, independent of sync. The web (GitHub Pages) updates itself through the service worker. */
const UP_KEY = "gamgol-update", UP_API = "https://api.github.com/repos/tvspk/gamgol/releases/latest", UP_APK = "https://github.com/tvspk/gamgol/releases/latest/download/gamgol.apk";
const UP_EVERY = 20 * 3600000, UP_LATER = 24 * 3600000, UP_OPENED = 2 * 3600000;
function upLoad() { try { const u = JSON.parse(localStorage.getItem(UP_KEY)); return syObj(u) ? u : {}; } catch (e) { return {}; } }
function upSave(u) { try { localStorage.setItem(UP_KEY, JSON.stringify(u)); } catch (e) {} }
function upMine() { try { return window.AndroidApp && AndroidApp.version ? String(AndroidApp.version() || "") : ""; } catch (e) { return ""; } }
const upNum = v => String(v || "").replace(/^v/, "").split(".").map(x => parseInt(x, 10) || 0);
function upNewer(a, b) { const x = upNum(a), y = upNum(b); for (let i = 0; i < Math.max(x.length, y.length); i++) if ((x[i] || 0) !== (y[i] || 0)) return (x[i] || 0) > (y[i] || 0); return false; }
let upBusy = false;
async function upCheck() { const mine = upMine(); if (!mine || upBusy || !window.GG_LOCAL) return; const u = upLoad();
  if (Date.now() - (+u.at || 0) >= UP_EVERY && navigator.onLine !== false) { upBusy = true;
    try { const r = await fetch(UP_API, { cache: "no-store", credentials: "omit", referrerPolicy: "no-referrer", headers: { Accept: "application/vnd.github+json" } });
      if (r.ok) { const j = await r.json(); if (j && typeof j.tag_name === "string" && /^v?\d{1,4}(\.\d{1,4}){0,3}$/.test(j.tag_name)) u.latest = j.tag_name.replace(/^v/, ""); }
      u.at = Date.now(); upSave(u); } catch (e) {}
    upBusy = false; }
  if (R.screen === "home") upShow(); }
function upShow() { const old = $("#upbar"); if (old) old.remove(); const u = upLoad(), mine = upMine();
  if (!mine || !u.latest || !upNewer(u.latest, mine) || Date.now() < (+u.later || 0) || R.screen !== "home") return;
  const w = $("#main .wrap"); if (!w) return;
  const d = document.createElement("div"); d.className = "card upbar"; d.id = "upbar";
  d.innerHTML = `<p class="narr"><b>${esc(SYT.upNew(u.latest))}</b></p><div class="row">${syBtn(SYT.upGet, "up-get")}${syBtn(SYT.upLater, "up-later", "alt")}</div>`;
  w.prepend(d);
  $("#up-get").onclick = () => { const v = upLoad(); v.later = Date.now() + UP_OPENED; upSave(v); upShow(); try { AndroidApp.open(UP_APK); } catch (e) {} };
  $("#up-later").onclick = () => { const v = upLoad(); v.later = Date.now() + UP_LATER; upSave(v); upShow(); }; }
document.addEventListener("visibilitychange", () => { if (!document.hidden) setTimeout(upCheck, 1000); });
/* for the tests (web/tools/test_sync.py): read-only view of the sync state and the functions they call */
window.__sync = { get SY() { return SY; }, get R() { return R; }, set R(v) { R = v; }, get busy() { return syBusy; }, get cam() { return syCam; }, syNow, syMaybe, syLeave, syItems, syCount, sySets, save: () => save(), home: () => home() };
